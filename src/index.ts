import * as _backupCodes from "./rest_controllers/backupCodes";
import * as _bioVoice from "./rest_controllers/bioVoice";
import * as _creditBalance from "./rest_controllers/creditBalance";
import * as _numberLookup from "./rest_controllers/numberLookup";
import * as _registrationWidget from "./rest_controllers/registrationWidget";
import * as _sms from "./rest_controllers/sms";
import * as _totp from "./rest_controllers/totp";
import * as _verification from "./rest_controllers/verification";
import * as _verificationWidget from "./rest_controllers/verificationWidget";

import SMS from "./models/SMS";
import NumberLookup from "./models/NumberLookup";
import Verification from "./models/Verification";

import { streamToJson } from "./streamToJson";

export const config = (host:string, apiKey:string): void => {
    if (process.env.TWIZO_HOST == null)
        (!host) ? console.error(TypeError("No Twizo host specified")) : process.env.TWIZO_HOST = host;

    if (process.env.TWIZO_API_KEY == null)
        (!apiKey) ? console.error(TypeError("No Twizo api key specified")) : process.env.TWIZO_API_KEY = apiKey;
}

export const models = {
    SMS,
    NumberLookup,
    Verification
}

export const backupCodes = {
    /**
     * Create the backup codes
     * @param identifier    This is a mandatory string parameter.
                        The identifier must be a unique identifier of the user, e.g. an email address.
     */
    async create(identifier:string): Promise<any> {
        let ret;
        await _backupCodes.create(identifier)
        .then(streamToJson)
        .then(res => ret = res)
        .catch(err => {throw err});
        return ret;
    },

    /**
     * When the user uses a backup code and entered it in your website, the API will verify the backup code with the backup codes generated for the user.
     * @param identifier    The identifier you used to generate the backup codes for the user.
     * @param backupCode    The backup code entered by the user and you want to verify with the generated backup codes for the user.
     */
    async verify(identifier:string, backupCode:string): Promise<any> {
        let ret;
        await _backupCodes.verify(identifier, backupCode)
        .then(streamToJson)
        .then(res => ret = res)
        .catch(err => {throw err});
        return ret;
    },

    /**
     * Check how many baackup codes a user has left
     * @param identifier    The identifier you used for generating the backup codes for the user.
     */
    async checkRemaining(identifier:string): Promise<any> {
        let ret;
        await _backupCodes.check(identifier)
        .then(await streamToJson)
        .then(res => ret = res.amountOfCodesLeft)
        .catch(err => {throw err});
        return ret;
    },

    /**
     * When you have generated backup codes for a user before, you can update the backup codes.
       When you update the backup codes of a user, new backup codes will be generated and the old remaining backup codes will be invalid.
     * @param identifier    The identifier you used for generating the backup codes for the user.
     */
    async update(identifier:string): Promise<any> {
        let ret;
        await _backupCodes.update(identifier)
        .then(streamToJson)
        .then(res => ret = res)
        .catch(err => {throw err});
        return ret;
    },

    /**
     * You can delete the backup codes of a user.
       The user will then not be able to use any of backup codes generated before.
       To delete the backup codes of a user you have to do a DELETE to our API with the ‘identifier’.
     * @param identifier    The identifier you used for generating the backup codes for the user.
     */
    async delete(identifier:string): Promise<any> {
        let ret;
        await _backupCodes.del(identifier)
        .then(res => ret = res.statusCode)
        .catch(err => {throw err});
        return ret;
    }
}

export const bioVoice = {
    /**
     * Register a bio voice verification
     * @param recipient The number used for the bio voice verification
     */
    async registration(recipient:string): Promise<any> {
        let ret;
        await _bioVoice.registration(recipient)
        .then(streamToJson)
        .then(res => ret = res)
        .catch(err => {throw err});
        return ret;
    },

    /**
     * While a registration is in progress, you cannot perform a bio voice verification yet.
       Check the status of the registration through this function.
     * @param recipient The recipient number you used for creating the bio voice registration for the user.
     */
    async registrationStatus(recipient:string): Promise<any> {
        let ret;
        await _bioVoice.registrationStatus(recipient)
        .then(streamToJson)
        .then(res => ret = res)
        .catch(err => {throw err});
        return ret;
    },

    /**
     * Check the status of a bio voice subscription.
     * @param recipient The recipient number you used for creating the bio voice registration for the user.
     */
    async status(recipient:string): Promise<any> {
        let ret;
        await _bioVoice.status(recipient)
        .then(streamToJson)
        .then(res => ret = res)
        .catch(err => {throw err});
        return ret;
    },

    /**
     * ou can delete a bio voice subscription of a user.
       The user will then not be able to use the bio voice verification anymore.
     * @param recipient The recipient number you used for creating the bio voice registration for the user.
     */
    async delete(recipient:string): Promise<any> {
        let ret;
        await _bioVoice.del(recipient)
        .then(res => ret = res.statusCode)
        .catch(err => {throw err});
        return ret;
    }
}

/**
 * Get the current credit balance from your wallet
 */
export const getCreditBalance = async(): Promise<any> => {
    let ret;
    await _creditBalance.getBalance()
    .then(streamToJson)
    .then(res => ret = res)
    .catch(err => {throw err});
    return ret;
}

export const numberLookup = {
    /**
     * Submit a new number lookup request
     * @param body	A string or object representing the json object to send with your request.
     * 		@param messages A required string array to send with the body
     */
    async submit(body:string | Object): Promise<any> {
        let ret;
        await _numberLookup.submit(body)
        .then(streamToJson)
        .then(res => {ret = res})
        .catch(err => {throw err});
        return ret;
    },

    /**
     * Get the status of the given lookup id
     * @param message_id	The ID for the lookup request you want to check on
     */
    async status(message_id:string): Promise<any> {
        let ret;
        await _numberLookup.status(message_id)
        .then(streamToJson)
        .then(res => ret = res)
        .catch(err => {throw err});
        return ret;
    },

    /**
     * Retrieve the results for your number lookup, to a maximum of 10 at a time
     */
    async result(): Promise<any> {
        let ret;
        await _numberLookup.result()
        .then(streamToJson)
        .then(res => ret = res)
        .catch(err => console.error(err));
        return ret;
    }
}

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
export const registrationWidget = async (body: string | Object): Promise<any> => {
    let ret;
    await _registrationWidget.registrationWidget(body)
    .then(streamToJson)
    .then(res => ret = res)
    .catch(err => {throw err});
    return ret
}

export const sms = {
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
    async submitSimple(body:string | Object): Promise<any> {
        let ret;
        await _sms.submitSimple(body)
        .then(streamToJson)
        .then(res => ret = res)
        .catch(err => {throw err});
        return ret;
    },

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
    async submit(body:string | Object): Promise<any> {
        let ret;
        await _sms.submit(body)
        .then(streamToJson)
        .then(res => ret = res)
        .catch(err => {throw err});
        return ret;
    },

    /**
     * You can check the status of an SMS with a simple GET and specifying the ‘messageId’ returned in the submit of the SMS.
     * @param messageId The messageId returned in the submit of the sms.
     */
    async status(messageId:string): Promise<any> {
        let ret;
        await _sms.status(messageId)
        .then(streamToJson)
        .then(res => ret = res)
        .catch(err => {throw err});
        return ret;
    },

    /**
     * Apart from checking the status of an SMS, you can also retrieve delivery reports.
       Each time you check for delivery reports you will receive up to maximum 10 delivery reports at a time.
       When you received the delivery reports you will need to confirm them so that our system knows you received them correctly.
       If you do not confirm them, after a timeout of 5 minutes, the same delivery reports will be available again.
       If you do not retrieve/confirm delivery reports, they will automatically be removed after 24 hours.
       When you are using one of our libraries or SDK's you do not have to confirm the delivery reports, it will be done for you, so you don't have to confirm.
     */
    async deliveryReports():Promise<any> {
        let ret;
        await _sms.deliveryReports()
        .then(streamToJson)
        .then(res => ret = res)
        .catch(err => {throw err});
        return ret;
    }
}

export const totp = {
    /**
     * You will need to specify in JSON format the identifier and issuer you want to create a TOTP for. The parameters you can set are:
     * @param identifier    This is a mandatory string parameter.
                            The identifier must be a unique identifier of the user, e.g. an email address.
                            The identifier will be visible in the Twizo Authenticator app as the application name.
     * @param issuer        This is a mandatory string parameter.
                            The issuer is the name of the site the user wants to login to.
                            The issuer will be visible to the user when he scans the TOTP with the Twizo Authenticator app and shows for which website the TOTP is.
     */
    async create(identifier:string, issuer:string): Promise<any> {
        let ret;
        await _totp.create(identifier, issuer)
        .then(streamToJson)
        .then(res => ret = res)
        .catch(err => {throw err});
        return ret;
    },

    /**
     * When the user uses a TOTP token and entered it in your website, the API will verify the token with the TOTP generated for the user.
     * @param identifier    The identifier you used to generate the TOTP for the user. 
     * @param token         The TOTP token entered by the user and you want to verify with the generated TOTP for the user.
     */
    async verify(identifier:string, token:string): Promise<any> {
        let ret;
        await _totp.verify(identifier, token)
        .then(streamToJson)
        .then(res => ret = res)
        .catch(err => {throw err});
        return ret;
    },

    /**
     * Check the status of the TOTP
     * @param identifier    The identifier you used for generating the TOTP for the user.
     */
    async status(identifier:string): Promise<any> {
        let ret;
        await _totp.status(identifier)
        .then(streamToJson)
        .then(res => ret = res)
        .catch(err => {throw err});
        return ret;
    },

    /**
     * You can delete a TOTP of a user.
       The user will then not be able to use the TOTP anymore.
       To delete a TOTP of a user you have to do a DELETE to our API with the ‘identifier’.
       When the API has deleted the TOTP you will get a HTTP status 204 'No content' returned from the API. 
     * @param identifier    The identifier you used for generating the TOTP for the user.
     */
    async delete(identifier:string): Promise<any> {
        let ret;
        await _totp.del(identifier)
        .then(res => ret = res.statusCode)
        .catch(err => {throw err});
        return ret;
    }
}

export const verification = {
    /**
     * Submit a new verification session
     * @param body  A string or object representing the json object to send with your request.
     *      @param recipient    A required string to send with the body
     */
    async submit(body:string | Object): Promise<any> {
        let ret;
        await _verification.submit(body)
        .then(streamToJson)
        .then(res => ret = res)
        .catch(err => {throw err});
        return ret;
    },

    /**
     * Verify the user that started a verification session
     * @param messageId    The sessionId of the verification session
     * @param token             The token submitted by the user
     */
    async verify(messageId:string, token: string): Promise<any> {
        let ret;
        await _verification.verify(messageId, token)
        .then(streamToJson)
        .then(res => ret = res)
        .catch(err => {throw err});
        return ret;
    },

    /**
     * Check the status of a verification session
     * @param messageId    The id of the verification session 
     */
    async status(messageId:string): Promise<any> {
        let ret;
        await _verification.status(messageId)
        .then(streamToJson)
        .then(res => ret = res)
        .catch(err => {throw err});
        return ret;
    },

    /**
     * Check the verification types your app allows
     * You can change these settings through our website at https://portal.twizo.com/accounts/?_ga=2.107132999.431197071.1522044814-11362802.1519613991
     */
    async verificationTypes(): Promise<any> {
        let ret;
        await _verification.verificationTypes()
        .then(streamToJson)
        .then(res => ret = res)
        .catch(err => {throw err});
        return ret;
    }
}

/**
 * Create a new widget verification session
 * @param body  A string or object representing the json object to send with your request.
 *      @param recipient    A required string to send with the body
 */
export const verificationWidget = async (body: string | Object): Promise<any> => {
    let ret;
    await _verificationWidget.verificationWidget(body)
    .then(streamToJson)
    .then(res => ret = res)
    .catch(err => {throw err});
    return ret;
}
