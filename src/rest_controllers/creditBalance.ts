import { IncomingMessage } from "http";
import { get } from "../https/requestConstructor"
import TwizoError from "../twizoError";

/**
 * Retrieve the current credit balance from your wallet.
 * You can create a webhook to trigger if your funds fall below a limit through our portal.
 */

const url:string = "/v1/wallet/getbalance";

/**
 * Get the current credit balance from your wallet
 */
export const getBalance = (): Promise<IncomingMessage> => {
    return new Promise((resolve, reject) => {
        const req = get(url)
        .then(resolve)
        .catch(err => {
            if (err instanceof TwizoError) reject(err);
            else reject(new TwizoError(err.message));
        });
    });
}
