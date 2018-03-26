import { get, post, del } from "../https/requestConstructor";
import { IncomingMessage } from "http";
import TwizoError from "../twizoError";
import { streamToJson } from "../streamToJson";
import SMS from "../models/SMS";

/**
 * With our SMS API you can easily send SMS messages to any operator in the world. 
 */

const url:string = "/v1/sms";

/**
 * Submit a new simple SMS
 * @param body  A string or object representing the json object to send with your request.
 *      @param recipients   This is a mandatory array with strings parameter.
                            It should be an array of numbers (in string format), in international format, for the SMS.
                            At least 1 number must be set and maximum 1000.
 *      @param body         This is a mandatory string parameter.
                            The body of the SMS.
                            The API will automatically determine if the body is Unicode or not and when the body is too long for a single SMS the API will automatically split up the body into multiple parts.
                            The maximum number of concatenated parts is 9.
                            See our tutorials ‘Unicode’ and ‘Concatenated/long SMS’ for more information. https://www.twizo.com/developers/tutorials/#unicode
 *      @param sender       This is a mandatory string parameter.
                            The sender is what the receiver of the SMS see as the submitter of the SMS.
                            See our tutorial ‘Sender’ for more information.
                            When it is numeric the maximum length is 17 digits, when it is alphanumeric the maximum length is 11.
 */
export const submitSimple = (body:string | Object | SMS): Promise<IncomingMessage> => {
    return new Promise((resolve, reject) => {
        if (body instanceof SMS) body = body.toString();
        else if (body instanceof Object) body = JSON.stringify(body);
        const req = post(`${url}/submitsimple`, (body as string))
        .then(resolve)
        .catch(err => {
            if (err instanceof TwizoError) reject(err);
            else reject(new TwizoError(err.message));
        });
    });
}

/**
 * Submit a new advanced SMS
 * @param body  A string or object representing the json object to send with your request.
 *      @param recipients   This is a mandatory array with strings parameter.
                            It should be an array of numbers (in string format), in international format, for the SMS.
                            At least 1 number must be set and maximum 1000.
 *      @param body         This is a mandatory string parameter.
                            The body of the SMS.
                            The body shall be send in GSM-7 alphabet and the maximum length is 160 characters.
                            When you want to send characters not in the GSM-7 alphabet you have to send it as Unicode.
                            In that case you have to set the DCS to 8.
                            The maximum length is in that case 70 characters.
                            When you send a concatenated message, you have to set a UDH as well and the maximum length for GSM-7 is then 153 characters and for Unicode 67 characters.
                            See our tutorials 'Unicode' and 'Concatenated/long SMS' for more information. https://www.twizo.com/developers/tutorials/#unicode
 *      @param sender       This is a mandatory string parameter.
                            The sender is what the receiver of the SMS see as the submitter of the SMS.
                            See our tutorial ‘Sender’ for more information.
                            When it is numeric the maximum length is 17 digits, when it is alphanumeric the maximum length is 11.
 */
export const submit = (body:string | Object): Promise<IncomingMessage> => {
    return new Promise((resolve, reject) => {
        if (body instanceof Object) body = JSON.stringify(body);
        const req = post(`${url}/submit`, (body as string))
        .then(resolve)
        .catch(err => {
            if (err instanceof TwizoError) reject(err);
            else reject(new TwizoError(err.message));
        });
    });
}

/**
 * You can check the status of an SMS with a simple GET and specifying the ‘messageId’ returned in the submit of the SMS.
 * @param messageId The messageId returned in the submit of the sms.
 */
export const status = (messageId:string): Promise<IncomingMessage> => {
    return new Promise((resolve, reject) => {
        const req = get(`${url}/submit/${messageId}`)
        .then(resolve)
        .catch(err => {
            if (err instanceof TwizoError) reject(err);
            else reject(new TwizoError(err.message));
        });
    });    
}

/**
 * Apart from checking the status of an SMS, you can also retrieve delivery reports.
   Each time you check for delivery reports you will receive up to maximum 10 delivery reports at a time.
   When you received the delivery reports you will need to confirm them so that our system knows you received them correctly.
   If you do not confirm them, after a timeout of 5 minutes, the same delivery reports will be available again.
   If you do not retrieve/confirm delivery reports, they will automatically be removed after 24 hours.
   When you are using one of our libraries or SDK's you do not have to confirm the delivery reports, it will be done for you, so you don't have to confirm.
 */
export const deliveryReports = (): Promise<IncomingMessage> => {
    return new Promise((resolve, reject) => {
        const req = get(`${url}/poll`)
        .then(res => {
			streamToJson(res)
                .then(jsonRes => {
                    const delReq = del(`${url}poll/${jsonRes.batchId}`);                 
                }).catch(err => { throw new TwizoError("error responding to result") });
			resolve(res);
		}).catch(err => {
            if (err instanceof TwizoError) reject(err);
            else reject(new TwizoError(err.message));
        });
    });
}
