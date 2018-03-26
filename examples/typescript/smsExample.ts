import { config, models, sms } from "twizo";

config("<Your Twizo host>", "<Your API key>");

/**
 * This example shows how to send an sms
 * Using the SMS helper class
 */
const message = new models.SMS(["60123456789"], "Hello from Twizo", "TwizoExample");
message.addTag("TwizoExample");

sms.submitSimple(message)
.then(console.log)
.catch(console.error);

/**
 * This example shows how to get the sms status
 */
sms.status("sms_message_id")
.then(console.log)
.catch(console.error);
