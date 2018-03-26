import { config, models, verification } from "twizo";

config("<Your Twizo host>", "<Your API key>");

/**
 * This example shows how to create a new verification
 * Using the Verification helper class
 */
const ver = new models.Verification("60123456789");
ver.addTag("TwizoExample");
ver.addTokenType("alphanumeric");
ver.addSessionId("verificationExample.0123456");

verification.submit(ver)
.then(console.log) // log the verification object
.catch(console.error);

/**
 * This example shows how to verify a verification using a token
 */
verification.verify("verificationExample.0123456", "12345")
.then(console.log) // log the verification result
.catch(console.error);

/**
 * This example shows how to get the status of a created verification
 */
verification.status("verificationExample.0123456")
.then(console.log) // log the status object
.catch(console.error);
