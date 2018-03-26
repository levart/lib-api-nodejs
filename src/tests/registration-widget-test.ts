import test from "ava";
import { registrationWidget } from "../rest_controllers/registrationWidget";

require("dotenv").config();

test("registration widget test", t => {
    t.plan(1);
    const body = {
        allowedTypes: ["sms"],
        recipient: "60100001000"
    }
    return registrationWidget(body)
    .then(res => t.is(res.statusCode, 201))
    .catch(err => t.fail(err.message));
});

/*-----BAD WEATHER TESTS----- */
test("registration widget bad weather test", t => {
    t.plan(1);
    const body = {
        allowedTypes: ["sms"],
        number: "60123456789"
    }
    return registrationWidget(body)
    .then(res => t.is(res.statusCode, 422)) //should be 400?
    .catch(err => t.fail(err.message));
});