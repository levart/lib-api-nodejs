import { post, get, del as _del } from "../https/requestConstructor";
import { IncomingMessage } from "http";
import TwizoError from "../twizoError";

/**
 * Bio voice verification is a verification based on your voice.
   In order to be able to do such verification, you first have to register a user for it.
   This is done via a phone call where the user needs to say a sentence 3 times.
   Based on this a voice print of the user is created.
 * So first start a registration, once the registration is completed, a subscription is created.
   The sentence the user has to say is by default 'Verify me with my voicepin'.
   If you want a different sentence, please contact our support.
 */

const url:string = "/v1/biovoice";

/**
 * Register a bio voice verification
 * @param recipient The number used for the bio voice verification
 */
export const registration = (recipient:string): Promise<IncomingMessage> => {
    return new Promise((resolve, reject) => {
        const req = post(`${url}/registration`, JSON.stringify({
            "recipient": recipient
        })).then(resolve)
        .catch(err => {
            if (err instanceof TwizoError) reject(err);
            else reject(new TwizoError(err.message));
        });
    });
}

/**
 * While a registration is in progress, you cannot perform a bio voice verification yet.
   Check the status of the registration through this function.
 * @param recipient The recipient number you used for creating the bio voice registration for the user.
 */
export const registrationStatus = (recipient:string): Promise<IncomingMessage> => {
    return new Promise((resolve, reject) => {
        const req = get(`${url}/registration/${recipient}`)        
        .then(resolve)
        .catch(err => {
            if (err instanceof TwizoError) reject(err);
            else reject(new TwizoError(err.message));
        });        
    });
}

/**
 * Check the status of a bio voice subscription.
 * @param recipient The recipient number you used for creating the bio voice registration for the user.
 */
export const status = (recipient:string): Promise<IncomingMessage> => {
    return new Promise((resolve, reject) => {
        const req = get(`${url}/subscription/${recipient}`)
        .then(resolve)
        .catch(err => {
            if (err instanceof TwizoError) reject(err);
            else reject(new TwizoError(err.message));
        });
    });
}

/**
 * ou can delete a bio voice subscription of a user.
   The user will then not be able to use the bio voice verification anymore.
 * @param recipient The recipient number you used for creating the bio voice registration for the user.
 */
export const del = (recipient:string): Promise<IncomingMessage> => {
    return new Promise((resolve, reject) => {
        const req = _del(`${url}/subscription/${recipient}`)
        .then(resolve)
        .catch(err => {
            if (err instanceof TwizoError) reject(err);
            else reject(new TwizoError(err.message));
        });
    });
}
