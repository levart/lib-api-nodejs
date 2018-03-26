import test from "ava";
import SMS from "../../models/SMS";

test("SMS complete unit test", t => {
    t.plan(9);
    const sms = new SMS(["60123456789"], "Sms message", "TwizoTest");
    t.true(sms.isValid());
    sms.addTag("unit-test");
    t.true(sms.isValid());
    sms.addSenderTon(1);
    t.true(sms.isValid());
    sms.addSenderNpi(5);
    t.true(sms.isValid());
    sms.addPid(127);
    t.true(sms.isValid());
    sms.addScheduledDelivery("2024-08-16");
    t.true(sms.isValid());
    sms.addValidity(5000);
    t.true(sms.isValid());
    sms.addResultType(1);
    t.false(sms.isValid());
    sms.addCallbackUrl("https://call.back/url");
    t.true(sms.isValid());
});

/**-----SMS BAD WEATHER UNIT TESTS----- */
test("SMS unit resultType without callbackUrl", t => {
    t.plan(6);
    const sms = new SMS(["60123456789"], "bad weather test as message", "TwizoTest");
    sms.addResultType(1);
    t.is(sms.resultType, 1);
    t.false(sms.isValid());    
    try {
        sms.toString();
    } catch (err) {
        t.is(err.message, "SMS is not valid");
    }
    sms.addResultType(3);
    t.is(sms.resultType, 3);
    t.false(sms.isValid());
    try {
        sms.toString();
    } catch (err) {
        t.is(err.message, "SMS is not valid");
    }
});

test("SMS unit add resultType out of bounds", t => {
    t.plan(2);
    const sms = new SMS(["60123456789"], "bad weather test as message", "TwizoTest");
    try {
        sms.addResultType(-1);
    } catch (err) {
        t.is(err.message, "added a non-valid ResultType");
    }
    try {
        sms.addResultType(4);
    } catch (err) {
        t.is(err.message, "added a non-valid ResultType");
    }
});

test("SMS unit add pid out of bounds", t => {
    t.plan(2);
    const sms = new SMS(["60123456789"], "bad weather test as message", "TwizoTest");
    try {
        sms.addPid(-1);
    } catch (err) {
        t.is(err.message, "pid out of bounds, must be between 0 and 255");
    }
    try {
        sms.addPid(256);
    } catch (err) {
        t.is(err.message, "pid out of bounds, must be between 0 and 255");
    }
});
