import TwizoError from "../twizoError";
/**
 * A helper model for number lookup calls
 */
export default class NumberLookup {
    numbers:string[] = [];
    tag:string | undefined;
    validity:number | undefined;
    resultType:number | undefined;
    callbackUrl:string | undefined;

    /**
     * The number lookup class
     * @param numbers   This is a mandatory array with string parameter.
     *                  It should be an array of numbers (in string format), in international format, for the number lookup.
     *                  At least 1 number must be set and maximum 1000 numbers can be set.
     */
    constructor(numbers?:string[]) {
        if (numbers) this.numbers = numbers;
    }

    /**
     * Add a single number string
     * @param number    a string containing the number to add to the numbers array
     */
    addNumber(number: string): void {
        if (number) this.numbers.push(number);
    }

    /**
     * Add an array of numbers
     * @param numbers   a string array to add to the numbers array
     */
    addNumbers(numbers: string[]): void {
        //todo filter empty numbers?
        if(numbers) this.numbers = this.numbers.concat(numbers);
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
     * The validity specifies how long the Number Lookup is valid.
     * The validity is in seconds.
     * If the Number Lookup could not be performed within this time, the Number Lookup is expired.
     * The minimum value of the validity is 5 seconds and the maximum value is 259200 seconds (= 72 hours).
     * The default value is 259200 seconds.
     * @param validity  The amount of time (in seconds) the Number Lookup is valid
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
        if (!this.numbers[0]) return false;
        if (this.resultType)
            if (this.resultType < 0 || this.resultType > 3) return false;
        if (!this.callbackUrl && (this.resultType === 1 || this.resultType === 3)) return false;
        
        return true;
    }

    /**
     * Turn your NumberLookup into a sendable string
     */
    toString(): string {
        if (!this.isValid()) throw new TwizoError("NumberLookup is not valid");
        return JSON.stringify(this);
    }
}
