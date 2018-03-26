export default class TwizoError extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, TwizoError);
    }
}