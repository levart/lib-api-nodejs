import test from "ava";
import { create, verify, check, update, del } from "../rest_controllers/backupCodes";
import { streamToJson } from "../streamToJson";

require("dotenv").config();

let codes:string[] = [];
const id:string = "test@twizo.com";

test.serial("Creation test", t => {
    t.plan(3);
    return create(id)
    .then(res => {
        t.is(res.statusCode, 201);
        return streamToJson(res)
        .then(jsonRes => {
            t.is(jsonRes.amountOfCodesLeft, 10);
            codes = jsonRes.codes;
            t.truthy(codes);
        });
    }).catch(err => t.fail(err.message));
});

test.serial("Verify codes[0]", t => {
    t.plan(1);
    return verify(id, codes[0])
    .then(res => t.is(res.statusCode, 200))
    .catch(err => t.fail(err.message));
});

test.serial("check statusCodes left", t => {
    t.plan(1);
    return check(id)
    .then (res => t.is(res.statusCode, 200))
    .catch(err => t.fail(err.message));
});

test.serial("update statusCodes", t => {
    t.plan(1);
    return update(id)
    .then(res => t.is(res.statusCode, 200))
    .catch(err => t.fail(err.message));
});

test("delete statusCodes", t => {
    t.plan(1);
    return del(id)
    .then(res => t.is(res.statusCode, 204))
    .catch(err => t.fail(err.message));
});