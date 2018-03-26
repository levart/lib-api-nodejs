import test from "ava";
import { create, verify, status, del } from "../rest_controllers/totp";

require("dotenv").config();

const identifier = "test@twizo.com";

test.serial("Create TOTP", t => {
    t.plan(1);
    return create(identifier, "testIssuer")
    .then(res => t.is(res.statusCode, 201))
    .catch(err => t.fail(err));
});

test.serial("Verify TOTP", t => {
    t.plan(1);
    return verify(identifier, "")
    .then(res => t.is(res.statusCode, 200))
    .catch(err => t.fail(err));
});

test.serial("Check TOTP status", t => {
    t.plan(1);
    return status(identifier)
    .then(res => t.is(res.statusCode, 200))
    .catch(err => t.fail(err));
});

test("Delete TOTP", t => {
    t.plan(1);
    return del(identifier)
    .then(res => t.is(res.statusCode, 204))
    .catch(err => t.fail(err));
});
