import { test } from "ava";
import { config, backupCodes, bioVoice, getCreditBalance, numberLookup, registrationWidget, sms, totp, verification, verificationWidget } from "../index";
// import Twizo from "../index";

const testMail:string = `indextest@twizo.com`;
const testNumber = `602000000000`;

/*-----INITIATE-----*/
test.before(`initiate twizo`, t => {
    t.plan(0);
    const dotEnv = require("dotenv").config();
    if (dotEnv.error) 
        t.fail(dotEnv.error);
    const twizo = config(dotEnv.parsed.TWIZO_HOST, dotEnv.parsed.TWIZO_API_KEY);
});

/*-----BACKUPCODES-----*/
{
    let backupCode:string;

    test.serial(`create backupCode test`, t => {
        t.plan(2);
        return backupCodes.create(testMail)
        .then(res => {
            t.is(res.amountOfCodesLeft, 10);
            backupCode = res.codes[0];
            t.truthy(backupCode);
        }).catch(err => t.fail(err.message));    
    });

    test.serial(`verify backupCode test`, t => {
        t.plan(1);
        return backupCodes.verify(testMail, backupCode)
        .then(res => t.is(res.amountOfCodesLeft, 9))
        .catch(err => t.fail(err.message));
    });

    test.serial(`check Remaining backupCodes test`, t => {
        t.plan(1);
        return backupCodes.checkRemaining(testMail)
        .then(res => t.is(res, 9))
        .catch(err => t.fail(err.message));
    });

    test.serial(`update backupCode test`, t => {
        t.plan(1);
        return backupCodes.update(testMail)
        .then(res => t.is(res.amountOfCodesLeft, 10))
        .catch(err => t.fail(err.message));  
    });

    test(`delete backupcodes test`, t => {
        t.plan(1);
        return backupCodes.delete(testMail)
        .then(res => {
            t.is(res, 204);
        }).catch(err => t.fail(err.message));
    });
}

/*-----CREDITBALANCE-----*/
{
    test("get credit balance test", t => {
        t.plan(1);
        return getCreditBalance()
        .then(res => t.truthy(res.credit))
        .catch(err => t.fail(err.message));
    });
}

/*-----NUMBERLOOKUP-----*/
{
    let messageId:string;
    test.serial("numberLookup submit test", t => {
        const body = {
            "numbers": [testNumber]
        }
        t.plan(2);
        return numberLookup.submit(body)
        .then(res => {
            t.truthy(res._embedded);
            messageId = res._embedded.items[0].messageId;
            t.truthy(messageId);
        }).catch(err => t.fail(err.message));
    });

    test.serial("numberLookup status test", t => {
        t.plan(1);
        return numberLookup.status(messageId)
        .then(res => t.is(res.messageId, messageId))
        .catch(err => t.fail(err.message));
    });

    test("numberLookup result test", t => {
        t.plan(1);
        return numberLookup.result()
        .then(res => t.truthy(res._embedded))
        .catch(err => t.fail(err.message));
    });
}

/*-----REGISTRATIONWIDGET-----*/
{
    test("registration widget test", t => {
        t.plan(1);
        return registrationWidget({"recipient": testNumber})
        .then(res => t.truthy(res.sessionToken))
        .catch(err => t.fail(err.message));
    });
}

/*-----SMS----- */
{
    let messageId:string;

    test("submit simple sms test", t => {
        t.plan(1);
        return sms.submitSimple({
            "recipients": [testNumber],
            "body": "testing through module entry",
            "sender": "TwizoTest"
        }).then(res => t.truthy(res._embedded))
        .catch(err => t.fail(err.message));
    });

    test.serial("submit sms test", t => {
        t.plan(2);
        return sms.submit({
            "recipients": [testNumber],
            "body": "testing through module entry",
            "sender": "TwizoTest"
        }).then(res => {
            t.truthy(res._embedded);
            messageId = res._embedded.items[0].messageId;
            t.truthy(messageId);
        }).catch(err => t.fail(err.message));
    });

    test("sms status test", t => {
        t.plan(1);
        return sms.status(messageId)
        .then(res => t.is(res.recipient, testNumber))
        .catch(err => t.fail(err.message));
    });

    test("sms deliveryReports test", t => {
        t.plan(1);
        return sms.deliveryReports()
        .then(res => t.truthy(res._embedded))
        .catch(err => t.fail(err.message));
    });
}

/*-----TOTP-----*/
{
    test.serial("totp create test", t => {
        t.plan(1);
        return totp.create(testMail, "twizoTest")
        .then(res => t.truthy(res.uri))
        .catch(err => t.fail(err.message));
    });

    test.serial("totp verify test", t => {
        t.plan(1);
        return totp.verify(testMail, "01234")
        .then(res => t.truthy(res._embedded))
        .catch(err => t.fail(err.message));
    });

    test.serial("totp status test", t => {
        t.plan(1);
        return totp.status(testMail)
        .then(res => t.truthy(res._links))
        .catch(err => t.fail(err.message));
    });

    test("totp delete test", t => {
        t.plan(1);
        return totp.delete(testMail)
        .then(res => t.is(res, 204))
        .catch(err => t.fail(err.message))
    });
}

/*-----VERIFICATION-----*/
{
    let messageId:string;

    test.serial("verification submit test", t => {
        t.plan(1);
        return verification.submit({
            "recipient": testNumber
        }).then(res => {
            t.truthy(res.messageId);
            messageId = res.messageId;
        }).catch(err => t.fail(err.message));
    });

    test("verification verify test", t => {
        t.plan(1);
        return verification.verify(messageId, "012345")
        .then(res => t.truthy(res._links))
        .catch(err => t.fail(err.message));
    });

    test("verification status test", t => {
        t.plan(1);
        return verification.status(messageId)
        .then(res => t.truthy(res._links))
        .catch(err => t.fail(err.message));
    });

    test("verification verificationTypes test", t => {
        t.plan(1);
        return verification.verificationTypes()
        .then(res => t.truthy(res))
        .catch(err => t.fail(err.message));
    });
}

/*-----VERIFICATIONWIDGET-----*/
{
    test("verificationWidget test", t => {
        t.plan(1);
        return verificationWidget({"recipient": testNumber})
        .then(res => t.is(res.recipient, testNumber))
        .catch(err => t.fail(err.message));
    });
}
