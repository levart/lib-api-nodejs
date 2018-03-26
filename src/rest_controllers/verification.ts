import { post, get } from "../https/requestConstructor"
import { IncomingMessage } from "http";
import TwizoError from "../twizoError";
import Verification from "../models/Verification";

/**
 * With our verification service you can easily integrate Two Factor Authentication (2FA) into your application.
   We will describe in a few simple steps how to do it.
   The below is for verifications via Twizo Authenticator - Push, Bio voice, SMS, Voice call, Telegram and Line.
   For a Bio voice verification, you first need to register. 
 */

const url:string = `/v1/verification/submit`;

/**
 * Submit a new verification session
 * @param body  A string or object representing the json object to send with your request.
 *      @param recipient    A required string to send with the body
 */
export const submit = (body:string | Object | Verification): Promise<IncomingMessage> => {
    return new Promise((resolve, reject) => {
        if (body instanceof Verification) body = body.toString();
        else if (body instanceof Object) body = JSON.stringify(body);
        if (!(body as string).includes(`"recipient":`)) reject(new TwizoError(`Body missing object "recipient"`));
        const req = post(url, (body as string))
        .then(resolve)
        .catch(err => {
            if (err instanceof TwizoError) reject(err);
            else reject(new TwizoError(err.message));
        });
    });
}

/**
 * Verify the user that started a verification session
 * @param messageId    The sessionId of the verification session
 * @param token             The token submitted by the user
 */
export const verify = (messageId:string, token: string): Promise<IncomingMessage> => {
    return new Promise((resolve, reject) => {
        const req = get(`${url}/${messageId}?token=${token}`)
        .then(resolve)
        .catch(err => {
            if (err instanceof TwizoError) reject(err);
            else reject(new TwizoError(err.message));
        });
    });
}

/**
 * Check the status of a verification session
 * @param messageId    The id of the verification session 
 */
export const status = (messageId:string): Promise<IncomingMessage> => {
    return new Promise((resolve, reject) => {
        const req = get(`${url}/${messageId}`)
        .then(resolve)
        .catch(err => {
            if (err instanceof TwizoError) reject(err);
            else reject(new TwizoError(err.message));
        });
    });
}

/**
 * Check the verification types your app allows
 * You can change these settings through our website at https://portal.twizo.com/accounts/?_ga=2.107132999.431197071.1522044814-11362802.1519613991
 */
export const verificationTypes = (): Promise<IncomingMessage> => {
    return new Promise((resolve, reject) => {
        const req = get(`/v1/application/verification_types`)
        .then(resolve)
        .catch(err => {
            if (err instanceof TwizoError) reject(err);
            else reject(new TwizoError(err.message));
        });
    });
}
