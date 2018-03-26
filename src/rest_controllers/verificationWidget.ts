import { post } from "../https/requestConstructor";
import { IncomingMessage } from "http";
import TwizoError from "../twizoError";

/**
 * With the verification widget you can easily integrate our verification service without the need of implementing forms to handle the verification.
   For more information how to integrate the widget, checkout our widget guide at https://www.twizo.com/developers/widget-guide.
 * When you create a widget verification session and start the widget, the widget will create one or more verifications.
   Those verifications will have as as sessionId the session token of the widget verification session. 
 */

const url:string = "/v1/widget/session";

/**
 * Create a new widget verification session
 * @param body  A string or object representing the json object to send with your request.
 *      @param recipient    A required string to send with the body
 */
export const verificationWidget = (body: string | Object):Promise<IncomingMessage> => {
    return new Promise((resolve, reject) => {
        if (body instanceof Object) body = JSON.stringify(body);
        if (!(body as string).includes("\"recipient\":")) reject(new TwizoError("Body missing object \"recipient\""));
        const req = post(url, (body as string))
        .then(resolve)
        .catch(err => {
            if (err instanceof TwizoError) reject(err);
            else reject(new TwizoError(err.message));
        });
    });
}
