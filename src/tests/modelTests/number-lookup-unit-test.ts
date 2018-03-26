import test from "ava";
import NumberLookup from "../../models/NumberLookup";

test("NumberLookup basic test", t => {
    t.plan(1);
    const num = new NumberLookup();
    num.addNumber("0612345");
    t.truthy(num.toString());
});

test("NumberLookup complete test", t => {
    t.plan(2);
    const num = new NumberLookup(["60123456789"]);
    num.addNumber("06123456789");
    num.addNumbers(["60987654321", "60123498765"]);
    num.addTag("unitTest");
    num.addValidity(800);
    num.addResultType(1);
    num.addCallbackUrl("https://unit.test");
    t.true(num.isValid());
    const numRes = JSON.parse(num.toString());
    t.is(numRes.numbers.length, 4);
});



/*-----NUMBERLOOKUP BAD WEATHER TESTS----- */
test("NumberLookup with empty numbers", t => {
    t.plan(1);
    const num = new NumberLookup();
    try {
        num.toString();
    } catch (err) {
        t.is(err.message, "NumberLookup is not valid");
    }
});

test("NumberLookup add invalid resultType", t => {
    t.plan(2);
    const num = new NumberLookup(["60123456789"]);
    try {
        num.addResultType(-1);
    } catch (err) {
        t.is(err.message, "added a non-valid ResultType");
    }
    try {
        num.addResultType(4);
    } catch (err) {
        t.is(err.message, "added a non-valid ResultType");
    }
});

test("NumberLookup without callback with resultType 1", t => {
    t.plan(1);
    const num = new NumberLookup(["06123456789"]);
    num.addResultType(1);
    try {
        num.toString();
    } catch (err) {
        t.is(err.message, "NumberLookup is not valid");
    }
});

test("NumberLookup without callback with resultType 3", t => {
    t.plan(1);
    const num = new NumberLookup(["06123456789"]);
    num.addResultType(3);
    try {
        num.toString();
    } catch (err) {
        t.is(err.message, "NumberLookup is not valid");
    }
});