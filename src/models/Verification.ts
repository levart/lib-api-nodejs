import TwizoError from "../twizoError";
/**
 * A helper model for verification calls
 */
export default class Verification {
    recipient:string;
    type:string | undefined;
    issuer:string | undefined;
    tokenLength:number | undefined;
    tokenType:string | undefined;
    tag:string | undefined;
    sessionId:string | undefined;
    validity:number | undefined;

    /**
     * The verify class
     * @param recipient This is a mandatory string parameter.
     *                  The recipient is a single phone number in international format.
     *                  The phone number can be a mobile number or a fixed phone number.
     */
    constructor(recipient:string) {
        this.recipient = recipient;
    }

    /**
     * 
     * @param type  This is an optional string parameter.
     *              The type defines how the token will be send to the phone.
     *              Possible values are: ‘sms', ‘call’, 'push', 'telegram' or 'line'.
     *              The default value is ‘sms’.
     */
    addType(type:string): void {
        if (type !== "sms" && type !== "call" && type !== "push" && type !== "telegram" && type !== "line") throw new TwizoError("added a non-valid type");
        this.type = type;
    }

    /**
     * 
     * @param issuer    This is a mandatory string parameter when the type is set to 'push', 'telegram' or 'line'.
     *                  The issuer is the name of the site the user wants to login to.
     *                  When the user receives the request to confirm he wants to login, the user will get a message like "Please confirm to verify your login of '<issuer>'".
     */
    addIssuer(issuer:string): void {
        this.issuer = issuer
    }

    /**
     * 
     * @param tokenLength   This is an optional integer parameter.
     *                      The tokenLength defines the length of the token.
     *                      The minimum value is 4 and the maximum value 10.
     *                      The default value is 6.
     *                      When you set the tokenLength, you have to set the tokenType as well.
     */
    addTokenLength(tokenLength:number): void {
        if (tokenLength < 4 || tokenLength > 10) throw new TwizoError("added a non-valid tokenLength");
        this.tokenLength = tokenLength;
    }

    /**
     * 
     * @param tokenType This is an optional string parameter.
     *                  Possible values are ‘numeric’ and ‘alphanumeric’.
     *                  Numeric token will only contain the digits 0-9.
     *                  For alphanumeric the token contains the digits 0-9 and characters a-z (lowercase).
     *                  The default value of the tokenType is ‘numeric’.
     *                  When you set the tokenType, you have to set the tokenLength as well.
     */
    addTokenType(tokenType:string): void {
        if (tokenType !== "alphanumeric" && tokenType !== "numeric") throw new TwizoError("added a non-valid tokenType");
        this.tokenType = tokenType;
    }

    /**
     * 
     * @param tag   This is an optional string parameter.
     *              The tag is a free text parameter you can use for your own reference.
     *              The maximum length of the tag is 30 characters.
     *              The tag parameter is returned in the result and you can use it for reporting purposes on your side.
     */
    addTag(tag:string): void {
        if (tag.length > 30) throw new TwizoError("tag length is too long, maximum length is 30");
        this.tag = tag;
    }

    /**
     * 
     * @param sessionId This is an optional string parameter.
     *                  If it is not set the API will automatically generate the value.
     *                  See ‘Verification session’ for more information.
     *                  The maximum length of the sessionId is 54 characters.
     */
    addSessionId(sessionId:string): void {
        if (sessionId.length > 54) throw new TwizoError("sessionId length is too long, maximum length is 54");
        this.sessionId = sessionId;
    }

    /**
     * 
     * @param validity  This is an optional integer parameter.
     *                  The validity specifies how long the token is valid.
     *                  The validity is in seconds.
     *                  If the token is not verified within this time, the token is expired.
     *                  The minimum value of the validity is 5 seconds and the maximum value is 3600 seconds (= 1 hour).
     *                  The default value is 60 seconds. 
     */
    addValidity(validity:number): void {
        if (validity < 5 || validity > 3600) throw new TwizoError("validity out of bounds, should be between 5 and 3600");
        this.validity = validity;
    }

    /**
     * Check if the Verification object is valid
     */
    isValid(): boolean {
        if (this.type && (this.type !== "sms" || "call" || "push" || "telegram" || "line"))
        //type telegram or line, check issuer
        if ((this.type === "telegram" || this.type === "line") && !this.issuer) return false;
        //tokenlength > 4 < 10
        if (this.tokenLength && (this.tokenLength < 4 || this.tokenLength > 10)) return false;
        //tokentype numeric or alphanumeric
        if (this.tokenType && (this.tokenType !== "numeric" && this.tokenType !== "alphanumeric")) return false;
        //taglength < 31
        if (this.tag && this.tag.length > 30) return false;
        //sessionid length < 55
        if (this.sessionId && this.sessionId.length > 55) return false
        //validity > 5 < 3600
        if (this.validity && (this.validity < 5 || this.validity > 3600)) return false

        return true;
    }

    /**
     * Turn your Verification into a sendable string
     */
    toString(): string {
        if (!this.isValid()) throw new TwizoError("Verification is not valid");
        return JSON.stringify(this);
    }
}

export class VerificationSMS extends Verification {
    bodyTemplate:string | undefined;
    sender:string | undefined;
    senderTon:number | undefined;
    senderNpi:number | undefined;
    dcs:number | undefined;

    /**
     * 
     * @param bodyTemplate  This is an optional string parameter.
     *                      The body template in case an SMS needs to be send.  
     *                      The body template must contain the tag ‘%token%’ which will be used by the system to replace it with the actual token to be send to the end user.
     *                      The maximum length on the body template is for GSM-7 alphabet 160 characters and for Unicode maximum 70 characters.
     *                      This is including the token which will be inserted by the system.
     *                      So if you set a tokenLength of 8, the max length of the bodyTemplate is 160-8=152 characters excluding the text '%token%'.
     *                      If you do not set the tokenLength, the API will need to consider the maximum length of the token (10) for the maximum bodyTemplate length, so in that case the bodyTemplate can have a maximum length of 150 characters for GSM-7 and 60 for Unicode.
     *                      Concatenated messages are not possible for these SMS messages.
     *                      See our tutorial ‘Unicode’ for more information on the maximum length of the body.
     *                      Default value for the bodyTemplate is: Your verification token is: %token%
     */
    addBodyTemplate(bodyTemplate:string): void {
        if (!bodyTemplate.includes("%token%")) throw new TwizoError("BodyTemplate missing tag %token%");
        this.bodyTemplate = bodyTemplate;
    }

    /**
     * 
     * @param sender    This is an optional string parameter.
     *                  The sender is what the receiver of the SMS see as the submitter of the SMS.
     *                  See our tutorial ‘Sender’ for more information.
     *                  The default value for the sender is ‘Twizo’.
     */
    addSender(sender:string): void {
        this.sender = sender;
    }

    /**
     * 
     * @param senderTon This is an optional integer parameter.
     *                  If it is not set the API will automatically detect the value.
     *                  See our tutorial ‘Sender’ for more information.
     */
    addSenderTon(senderTon:number): void {
        this.senderTon = senderTon;
    }

    /**
     *  
     * @param senderNpi This is an optional integer parameter.
     *                  If it is not set the API will automatically detect the value.
     *                  See our tutorial ‘Sender’ for more information.
     */
    addSenderNpi(senderNpi:number): void {
        this.senderNpi = senderNpi;
    }

    /**
     * 
     * @param dcs   This is an optional integer parameter.
     *              With the DCS parameter you can specify the character set of the bodyTemplate.
     *              For GSM-7 the value should be 0 and for Unicode the value should be 8.
     *              The default value is 0. See our tutorial ‘Unicode’ for more information.
     */
    addDcs(dcs:number): void {
        this.dcs = dcs;
    }

    /**
     * Check if the VerificationSms object is valid
     */
    isValid(): boolean {
        if (!super.isValid()) return false;
        if (this.bodyTemplate && !this.bodyTemplate.includes("%token%")) return false;

        return true;
    }
}
