const twizo = require("twizo");

twizo.config("<Your Twizo host>", "<Your API key>");

/**
 * This example shows how to create a numberlookup
 * Using the NumberLookup helper class
 */
const numLookup = new twizo.models.NumberLookup(["60123456789"]);
numLookup.addTag("TwizoExample");

twizo.numberLookup.submit(numLookup)
.then(console.log)
.catch(console.error);

/**
 * This example shows how to get the numberLookup status
 */
twizo.numberLookup.status("numberLookup_message_id")
.then(console.log)
.then(console.error);

/**
 * This exapmle shows how to poll for results
 */
twizo.numberLookup.result()
.then(console.log)
.catch(console.error);
