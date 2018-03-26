import test from "ava";
import * as numLookup from "../rest_controllers/numberLookup";
import { streamToJson } from "../streamToJson";
import TwizoError from "../twizoError";

/**
 * Apply the host and apiKey from the .env file before running the tests
 */
require('dotenv').config();

let submitNr: string;

test.serial("nubmerLookup submit test", t => {
	t.plan(1);

	const body = {
		numbers: ["60123456789"]
	}

	return numLookup.submit(body)
	.then(res => {
		return streamToJson(res)
		.then(jsonRes => {
			submitNr = jsonRes._embedded.items[0].messageId;
			t.is(res.statusCode, 201);
		});
	}).catch(err => {
		console.error("caught an error in submit:\n" + err);
		t.fail(err.message);
	});
});

test("numberLookup status test", t => {
	t.plan(1);	
	return numLookup.status(submitNr)
	.then(res => {
		t.is(res.statusCode, 200);
	}).catch(err => {
		console.error("caught an error in status:\n" + err);
		t.fail(err);
	});
});

test("numberLookup result test", t => {
	t.plan(1);
	return numLookup.result()
	.then(res => {
		t.is(res.statusCode, 200);
	}).catch(err => {
		console.error("caught an error in result:\n" + err);
		t.fail(err);
	});
});

/*-----BAD WEATHER TESTS----- */
test("numberLookup status bad-weather test", t => {
	t.plan(1);
	return numLookup.status("fake_message_id")
	.then(res => {
		t.is(res.statusCode, 404);
	}).catch(err => {
		console.error(err);
		t.fail("caught an unexpected error\n" + err);
	});
});

test("nubmerLookup submit bad-weather test", t => {
	t.plan(1);
	return numLookup.submit("testBody")
	.then(res => {
		t.fail("expected a TwizoError");
	}).catch(err => t.is(err.message, "Body missing object \"numbers\""));
});
