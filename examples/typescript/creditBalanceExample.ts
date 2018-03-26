import { config, getCreditBalance } from "twizo";

config("<Your Twizo host>", "<Your API key>");

/**
 * This example shows how to get the credit balance for your account
 */
getCreditBalance()
.then(console.log)
.catch(console.error);