const twizo = require("twizo");

twizo.config("<Your Twizo host>", "<Your API key>");

/**
 * This example shows how to send an sms
 * Using the SMS helper class
 */
const message = new twizo.models.SMS(["60123456789"], "Hello from Twizo", "TwizoExample");
message.addTag("TwizoExample");

twizo.sms.submitSimple(message)
.then(console.log)
.catch(console.error);

/**
 * This example shows how to get the sms status
 */
twizo.sms.status("sms_message_id")
.then(console.log)
.catch(console.error);
