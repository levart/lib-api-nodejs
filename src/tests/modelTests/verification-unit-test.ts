import test from "ava";
import Verification from "../../models/Verification";

test("Verification basic test", t => {
    t.plan(1);
    const ver = new Verification("60123456789");
    t.truthy(ver.toString());
});

test("Verification complete unit test", t => {
    t.plan(9);
    const ver = new Verification("60123456789");
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

test("tokenLength edges test", t => {
    t.plan(4);
    const ver = new Verification("60123456789");
    ver.addTokenLength(10);
    t.true(ver.isValid());
    t.is(ver.tokenLength, 10);
    ver.addTokenLength(4);
    t.true(ver.isValid());
    t.is(ver.tokenLength, 4);
});

test("tag length test", t => {
    t.plan(2);
    const ver = new Verification("60123456789");
    ver.addTag("thisStringShouldBe30CharsLong!");
    t.true(ver.isValid());
    t.is(ver.tag, "thisStringShouldBe30CharsLong!")
});

test("sessionId length test", t => {
    t.plan(2);
    const ver = new Verification("60123456789");
    ver.addSessionId("thisStringShouldBeFifty-FourCharactersLongBoleh-Boleh!");
    t.true(ver.isValid());
    t.is(ver.sessionId, "thisStringShouldBeFifty-FourCharactersLongBoleh-Boleh!");
});

test("validity edges test", t => {
    t.plan(4);
    const ver = new Verification("60123456789");
    ver.addValidity(5);
    t.true(ver.isValid());
    t.is(ver.validity, 5);
    ver.addValidity(3600);
    t.true(ver.isValid());
    t.is(ver.validity, 3600);
});


/*-----VERIFICATION BAD WEATHER TESTS----- */
test("Verification with wrong type", t => {
    t.plan(1);
    const ver = new Verification("60123456789");
    try {
        ver.addType("carrierPidgeon");
    } catch (err) {
        t.is(err.message, "added a non-valid type");
    }
});

test("telegram & line type without callback", t => {
    t.plan(2);
    const telegram = new Verification("60123456789");
    telegram.addType("telegram");
    try {
        telegram.toString();
    } catch (err) {
        t.is(err.message, "Verification is not valid");
    }

    const line = new Verification("60987654321");
    line.addType("line");
    try {
        line.toString();
    } catch (err) {
        t.is(err.message, "Verification is not valid");
    }
});

test("tokenlength too high & too low", t => {
    t.plan(2);
    const ver = new Verification("60123456789");
    try {
        ver.addTokenLength(3);
    } catch (err) {
        t.is(err.message, "added a non-valid tokenLength");
    }

    try {
        ver.addTokenLength(11);
    } catch (err) {
        t.is(err.message, "added a non-valid tokenLength");
    }
});

test("tokenType wrong type", t => {
    t.plan(1);
    const ver = new Verification("60123456789");
    try {
        ver.addTokenType("supermanaric");
    } catch (err) {
        t.is(err.message, "added a non-valid tokenType");
    }
});

test("tagLength too long", t => {
    t.plan(1);
    const ver = new Verification("60123456789");
    try {
        ver.addTag("this string long enough? should be prox 42");
    } catch (err) {
        t.is(err.message, "tag length is too long, maximum length is 30");
    }
});

test("sessionId length too high", t => {
    t.plan(1);
    const ver = new Verification("60123456789");
    try {
        ver.addSessionId("What's with all these long numbers? do people really generate these kinds of id's?");
    } catch (err) {
        t.is(err.message, "sessionId length is too long, maximum length is 54");
    }
});

test("validity too high & too low", t => {
    t.plan(2);
    const ver = new Verification("60123456789");
    try {
        ver.addValidity(4);
    } catch (err) {
        t.is(err.message, "validity out of bounds, should be between 5 and 3600");
    }

    try {
        ver.addValidity(3601);
    } catch (err) {
        t.is(err.message, "validity out of bounds, should be between 5 and 3600");
    }
});
