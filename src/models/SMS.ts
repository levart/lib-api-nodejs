import TwizoError from "../twizoError";

export default class SMS {
    recipients:string[];
    body:string;
    sender:string;
    senderTon:number | undefined;
    senderNpi:number | undefined;
    pid:number | undefined;
    scheduledDelivery:string | undefined;
    tag:string | undefined;
    validity:number | undefined;
    resultType:number | undefined;
    callbackUrl:string | undefined;

    /**
     * The SMS class
     * @param recipients    This is a mandatory array with strings parameter.
     *                      It should be an array of numbers (in string format), in international format, for the SMS.
     *                      At least 1 number must be set and maximum 1000.
     * @param body          This is a mandatory string parameter.
     *                      The body of the SMS.
     *                      The API will automatically determine if the body is Unicode or not and when the body is too long for a single SMS the API will automatically split up the body into multiple parts.
     *                      The maximum number of concatenated parts is 9.
     *                      See our tutorials ‘Unicode’ and ‘Concatenated/long SMS’ for more information.
     * @param sender        This is a mandatory string parameter.
     *                      The sender is what the receiver of the SMS see as the submitter of the SMS.
     *                      See our tutorial ‘Sender’ for more information.
     *                      When it is numeric the maximum length is 17 digits, when it is alphanumeric the maximum length is 11.
     */
    constructor(recipients:string[], body:string, sender:string) {
        //check sender numeric or alphanumeric
        //todo make regex
        // if (isNaN(sender)) //alphanumeric
        //     if (sender.length > 11) throw new TwizoError("Sender too long, alphanumeric senders can be up to 11 characters");
        // else //numeric
        //     if (sender.length > 17) throw new TwizoError("Sender too long, numeric sender can be up to 17 characters");
        this.recipients = recipients;
        this.body = body;
        this.sender = sender;
    }

    /**
     * Add a single number string
     * @param recipient a string containing the recipient's number to add to the recipients array
     */
    addRecipient(recipient:string) {
        if (recipient) this.recipients.push(recipient);
    }

    /**
     * Add an Array of numbers
     * @param recipients    A string array to add to the recipients array
     */
    addRecipients(recipients:string[]) {
        if (recipients) this.recipients = this.recipients.concat(recipients);
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
     * @param pid   This is an optional integer parameter.
     *              Can be used to send hidden SMS.
     *              Allowed values: 0-255. See also GSM specification .
     */
    addPid(pid:number) {
        //todo check
        if (pid < 0 || pid > 255) throw new TwizoError("pid out of bounds, must be between 0 and 255");
        this.pid = pid;
    }

    /**
     * 
     * @param scheduledDelivery This is an optional string parameter.
     *                          Datetime of scheduled delivery.
     *                          Must be in ISO-8601 format, example: 2016-10-31T12:34:56Z
     */
    addScheduledDelivery(scheduledDelivery:string) {
        //todo check
        this.scheduledDelivery = scheduledDelivery;
    }

    /**
     * This is an optional string parameter.
     * The tag is a free text parameter you can use for your own reference.
     * The maximum length of the tag is 30 characters.
     * The tag parameter is returned in the result and you can use it for reporting purposes on your side.
     * @param tag   A string to add as tag
     */
    addTag(tag: string): void {
        this.tag = tag;
    }

    /**
     * This is an optional integer parameter.
     * The validity specifies how long the message is valid.
     * The validity is in seconds.
     * If the message could not be performed within this time, the message is expired.
     * The minimum value of the validity is 5 seconds and the maximum value is 259200 seconds (= 72 hours).
     * The default value is 259200 seconds.
     * @param validity  The amount of time (in seconds) the message is valid
     */
    addValidity(validity: number): void {
        this.validity = validity;
    }

    /**
     * This is an optional integer parameter.
     * If you want to receive or poll for final results of your verifications, you can set the resultType.
     * You can use the results for your own reporting purposes.
     * Possible values of the resultType are: 
     * 0) No results (default)
     * 1) Callback (you have to specify the callbackUrl)
     * 2) Polling
     * 3) Callback & polling (you have to specify the callbackUrl)
     * @param resultType    The resulttype number
     */
    addResultType(resultType: number): void {
        if (resultType < 0 || resultType > 3) throw new TwizoError("added a non-valid ResultType");
        this.resultType = resultType;
    }

    /**
     * This string parameter is only mandatory when resultType is set to 1 or 3.
     * When the callbackUrl is set, this URL will be used by our system to submit status updates to you.
     * This parameter is only allowed when the resultType parameter is set to 1 or 3.
     * @param callbackUrl   The callbackURL to send the result to
     */
    addCallbackUrl(callbackUrl: string): void {
        this.callbackUrl = callbackUrl;
    }

    /**
     * Check the validity of your NumberLookup
     */
    isValid(): boolean {
        if (!this.recipients[0]) return false;
        if (this.resultType && (this.resultType < 0 || this.resultType > 3)) return false;
        if ((this.resultType === 1 || this.resultType === 3) && !this.callbackUrl) return false;
        
        return true;
    }

    /**
     * Turn your NumberLookup into a sendable string
     */
    toString(): string {
        if (!this.isValid()) throw new TwizoError("SMS is not valid");
        return JSON.stringify(this);
    }
}
