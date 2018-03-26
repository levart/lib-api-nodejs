import { config, backupCodes } from "twizo";

config("<Your Twizo host>", "<Your API key>");

/**
 * This example shows how to create backup codes
 */
backupCodes.create("example@twizo.com")
.then(console.log)
.catch(console.error);

/**
 * This example shows how to verify backup codes
 */
backupCodes.verify("example@twizo.com", "Your_backup_code")
.then(console.log)
.catch(console.error);

/**
 * This example shows how to check the remaining backup codes
 */
backupCodes.checkRemaining("example@twizo.com")
.then(console.log)
.catch(console.error);

/**
 * This example shows how to update the backup codes
 */
backupCodes.update("example@twizo.com")
.then(console.log)
.catch(console.error);

/**
 * This example shows how to delete the backup codes
 */
backupCodes.delete("example@twizo.com")
.then(console.log)
.catch(console.error);