import test from "ava";
import { submitSimple, submit, status, deliveryReports } from "../rest_controllers/sms";
import { streamToJson } from "../streamToJson";

require("dotenv").config();

let smsNr:string;

test.serial("sms submitSimple", t => {
    t.plan(2);
    const body = {
        recipients: ["60123456789"],
	    body: "Twizo test message",
        sender: "TwizoTest",
        tag: "NodeTest"
    }
    return submitSimple(body)
    .then(res => {
        t.is(res.statusCode, 201);
        return streamToJson(res)
        .then(jsonRes => {
            smsNr = jsonRes._embedded.items[0].messageId;
            t.truthy(smsNr);
        });
    }).catch(err => t.fail(err.message));
});

test.serial("sms submit", t => {
    t.plan(1);
    const body = {
        recipients: ["60123456789"],
	    body: "Twizo test message",
        sender: "TwizoTest",
        tag: "NodeTest"
    }
    return submit(body)
    .then(res => t.is(res.statusCode, 201))
    .catch(err => t.fail(err.message));
});

test("status test", t => {
    t.plan(1);
    return status(smsNr)
    .then(res => t.is(res.statusCode, 200))
    .catch(err => t.fail(err.message));
});

test("reportTest", t => {
    t.plan(1);
    return deliveryReports()
    .then(res  => t.is(res.statusCode, 200))
    .catch(err => t.fail(err.message));
});
