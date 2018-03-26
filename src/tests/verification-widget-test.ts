import test from "ava";
import { verificationWidget } from "../rest_controllers/verificationWidget";

require("dotenv").config();

test("verification widget test", t => {
    t.plan(1);
    const body = {
        recipient: "60123456789"
    }
    return verificationWidget(body)
    .then(res => t.is(res.statusCode, 201))
    .catch(err => t.fail(err.message));
});

/*-----BAD WEATHER TESTS----- */
test("verification widget test", t => {
    t.plan(1);
    const body = {
        numbers: "60123456789"
    }
    return verificationWidget(body)
    .then(res => t.fail("expected a TwizoError"))
    .catch(err => t.is(err.message, "Body missing object \"recipient\""));
});