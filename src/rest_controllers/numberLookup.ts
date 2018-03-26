import{ get, post, del } from "../https/requestConstructor";
import { IncomingMessage } from "http";
import TwizoError from "../twizoError";
import { streamToJson } from "../streamToJson";
import NumberLookup from "../models/NumberLookup";

/**
 *  With Number Lookup you can get information specific to a mobile phone number. You can get the following information:

    If the mobile number is still active or not (the number might be out of use because the subscription has ended).
    If the mobile number is ported to another operator (the current operator is different then the operator who issues the number).
    If the mobile number is roaming (connected to a network other then his home network, e.g. in another country).
 */

const url: string = `/v1/numberlookup`;

/**
 * Submit a new number lookup request
 * @param body	A string or object representing the json object to send with your request.
 * 		@param messages A required string array to send with the body
 */
export const submit = (body:string | Object | NumberLookup): Promise<IncomingMessage> => {
	return new Promise((resolve, reject) => {
        if (body instanceof NumberLookup) body = body.toString();
		else if (body instanceof Object) body = JSON.stringify(body);
		if (!(body as string).includes(`"numbers":`)) reject(new TwizoError(`Body missing object "numbers"`));
		const req = post(`${url}/submit`, (body as string))
		.then(resolve)
        .catch(err => {
            if (err instanceof TwizoError) reject(err);
            else reject(new TwizoError(err.message));
        });
	});
}

/**
 * Get the status of the given lookup id
 * @param message_id	The ID for the lookup request you want to check on
 */
export const status = (message_id: string): Promise<IncomingMessage> => {
	return new Promise<IncomingMessage>((resolve, reject) => {
		const req = get(`${url}/submit/${message_id}`)
		.then(resolve)
        .catch(err => {
            if (err instanceof TwizoError) reject(err);
            else reject(new TwizoError(err.message));
        });
	});
}

/**
 * Retrieve the results for your number lookup, to a maximum of 10 at a time
 */
export const result = (): Promise<IncomingMessage> => {
	return new Promise<IncomingMessage>((resolve, reject) => {
		const req = get(`${url}/poll`)
		.then(res => {
			streamToJson(res)
                .then(jsonRes => {const delReq = del(`${url}poll/${jsonRes.batchId}`)})
                .catch(err => { throw new TwizoError("error responding to result"); })
			resolve(res);
		}).catch(err => {
            if (err instanceof TwizoError) reject(err);
            else reject(new TwizoError(err.message));
        });
	});
}
