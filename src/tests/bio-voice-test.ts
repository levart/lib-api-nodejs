import { test } from "ava";
import { registration, registrationStatus, status, del } from "../rest_controllers/bioVoice";

require("dotenv").config();

const recipient:string = "60123400000";

/**
 * possible 409 conflict due to subscription not being deleted
 */
test.failing.serial("registration test", t => {
    t.plan(1);
    return registration(recipient)
    .then(res => t.is(res.statusCode, 201))
    .catch(err => t.fail(err.message));
});

/**
 * 404 can't find the recipient
 */
test.failing.serial("registration status test", t => {
    t.plan(1);
    return registrationStatus(recipient)
    .then(res => t.is(res.statusCode, 200))
    .catch(err => t.fail(err.message));
});

/**
 * 404 can't find the recipient
 */
test.failing.serial("subscription status test", t => {
    t.plan(1);
    return status(recipient)
    .then(res => t.is(res.statusCode, 200))
    .catch(err => t.fail(err.message));
});

/**
 * seems to work, but does not seem to delete the subscription
 */
test("Delete test", t => {
    t.plan(1);
    return del(recipient)
    .then(res => t.is(res.statusCode, 204))
    .catch(err => t.fail(err.message));
});
