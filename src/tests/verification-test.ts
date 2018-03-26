import test from "ava";
import { submit, verify, status, verificationTypes} from "../rest_controllers/verification";
import { streamToJson } from "../streamToJson";

/**
 * Apply the host and apiKey from the .env file before running the tests
 */
require("dotenv").config();

let submitNr:string;

test.serial("verification submit", t => {
    t.plan(2);
    const body = {
        recipient: "60123400000"
    }
    return submit(body)
    .then(res => {
        t.is(res.statusCode, 201);
        return streamToJson(res)
        .then(jsonRes => {
            submitNr = jsonRes.messageId;
            t.truthy(submitNr); 
        })
    }).catch(err => t.fail(err));
});

test("verification verify", t => {
    t.plan(1);
    return verify(submitNr, "012345")
    .then(res => t.is(res.statusCode, 200))
    .catch(err => t.fail(err));
});

test("verification status", t => {
    t.plan(1);
    return status(submitNr)
    .then(res => {
        t.is(res.statusCode, 200);
    }).catch(err => t.fail(err));
});

test("verification types", t => {
    t.plan(1);
    return verificationTypes()
    .then(res => t.is(res.statusCode, 200))
    .catch(err => t.fail(err));
});

/*-----BAD WEATHER TESTS----- */
test("verification submit bad-weather test, no recipient", t => {
    t.plan(1);
    const body = {
        number: "60123456789"
    }
    return submit(body)
    .then(res => t.fail("expected a TwizzoError"))
    .catch(err => t.is(err.message, "Body missing object \"recipient\""));
});


