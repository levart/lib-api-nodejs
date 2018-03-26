const twizo = require("twizo");

twizo.config("<Your Twizo host>", "<Your API key>");

/**
 * This example shows how to create backup codes
 */
twizo.backupCodes.create("example@twizo.com")
.then(console.log)
.catch(console.error);

/**
 * This example shows how to verify backup codes
 */
twizo.backupCodes.verify("example@twizo.com", "Your_backup_code")
.then(console.log)
.catch(console.error);

/**
 * This example shows how to check the remaining backup codes
 */
twizo.backupCodes.checkRemaining("example@twizo.com")
.then(console.log)
.catch(console.error);

/**
 * This example shows how to update the backup codes
 */
twizo.backupCodes.update("example@twizo.com")
.then(console.log)
.catch(console.error);

/**
 * This example shows how to delete the backup codes
 */
twizo.backupCodes.delete("example@twizo.com")
.then(console.log)
.catch(console.error);