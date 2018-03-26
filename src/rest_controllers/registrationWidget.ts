import { post } from "../https/requestConstructor";
import { IncomingMessage } from "http";
import TwizoError from "../twizoError";

/**
 * With the registration widget you can easily integrate our verification service without the need of implementing forms to register a user for the different verification types.
 * For more information how to integrate the widget, checkout our widget guide at https://www.twizo.com/developers/widget-guide.
 */

const url:string = "/v1/widget-register-verification/session";

/**
 * Create a new registration widget session
 * @param body  A string or object representing the json object to send with your request.
 *      @param allowedTypes         This is a optional array parameter.
                                    The allowedTypes defines which verification types the user can register for in the widget.
                                    Possible values are: ‘sms’, ‘call’, 'biovoice', 'push', 'totp', 'telegram', 'line' or 'backupcode'.
                                    When you do not set the parameter, the widget will use as default the types you have set for your account (Open the settings of the account and on the Verification tab select the types you want to allow your users to use).  
 *      @param recipient            This is a mandatory string parameter when for the allowedTypes 'sms' or 'call' is included.
                                    The recipient is a single phone number in international format. The phone number can be a mobile number or a fixed phone number.
 *      @param backupCodeIdentifier This is a mandatory string parameter when for the allowedTypes 'backupcode' is included.
                                    The backupCodeIdentifier is the identifier you used for creating the backup codes for the user.
 *      @param totpIdentifier       This is a mandatory string parameter when for the allowedTypes 'totp' is included.
                                    The totpIdentifier is the identifier you used for creating the TOTP for the user.
 *      @param issuer               This is a mandatory string parameter when you want to use a verification of type 'push', 'telegram' or 'line'.
                                    The issuer is the name of the site the user wants to login to. When the user receives the request to confirm he wants to login, the user will get a message like "Please confirm to verify your login of '<issuer>'".
 */
export const registrationWidget = (body: string | Object):Promise<IncomingMessage> => {
    return new Promise((resolve, reject) => {
        if (body instanceof Object) body = JSON.stringify(body);
        const req = post(url, (body as string))
        .then(resolve)
        .catch(err => {
            if (err instanceof TwizoError) reject(err);
            else reject(new TwizoError(err.message));
        });
    });
}
