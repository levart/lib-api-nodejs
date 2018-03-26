const twizo = require("twizo");

twizo.config("<Your Twizo host>", "<Your API key>");

/**
 * This example shows how to create a time-based one-time password
 */
twizo.totp.create("example@twizo.com", "Twizo")
.then(console.log)
.catch(console.error);

/**
 * This example shows how to verify a time-based one-time password
 */
twizo.totp.verify("example@twizo.com", "password")
.then(console.log)
.catch(console.error);

/**
 * This example shows how to get the status of a time-based one-time password
 */
twizo.totp.status("example@twizo.com")
.then(console.log)
.catch(console.error);

/**
 * This example shows how to delete a time-based one-time password
 */
twizo.totp.delete("example@twizo.com")
.then(console.log)
.catch(console.error);