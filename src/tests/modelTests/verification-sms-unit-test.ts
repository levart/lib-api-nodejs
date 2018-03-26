import test from "ava";
import { VerificationSMS } from "../../models/Verification";

test("Basic Verification object test in VerificationSMS", t => {
    t.plan(9);
    const ver = new VerificationSMS("60123456789");
    t.true(ver.isValid());
    ver.addType("telegram");
    t.false(ver.isValid());
    ver.addIssuer("testIssuer");
    t.true(ver.isValid());
    ver.addTokenLength(8);
    t.true(ver.isValid());
    ver.addTokenType("numeric");
    t.true(ver.isValid());
    ver.addTag("testTag");
    t.true(ver.isValid());
    ver.addSessionId("sessionId12345-test-67890");
    t.true(ver.isValid());
    ver.addValidity(2800);
    t.true(ver.isValid());
    t.truthy(ver.toString());
});

test("VarificationSMS with bodyTemplate", t => {
    t.plan(3);
    const ver = new VerificationSMS("0123456789");
    ver.addType("sms");
    t.true(ver.isValid());
    ver.addBodyTemplate("Hey user, your verification token is %token%");
    t.true(ver.isValid());
    t.truthy(ver.toString());
});


/**-----VERIFICATONSMS BAD WEATHER TESTS----- */

test("VerificationSMS add invalid bodyTemplate", t => {
    t.plan(2);
    const ver = new VerificationSMS("60123456789");
    ver.addType("sms");
    t.true(ver.isValid());
    try {
        ver.addBodyTemplate("Template without required body text");
    } catch (err) {
        t.is(err.message, "BodyTemplate missing tag %token%");
    }
});
