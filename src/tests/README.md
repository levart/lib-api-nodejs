# TWIZO-LIB-NODEJS TEST DOCUMENT

This document contains the test methods and results for the [twizo-lib-nodejs library][twizo-lib] (now referred to as "the library" or "library"). If you are unfamiliar with the workings of this library, refer to the twizo-lib-nodejs technical documentation.

## TEST ENVIRONMENT
[NPM][npm] (Node package manager) allows developers to easily set up tests. Define your test script in your `package.json`, run `npm run test`, `npm test` or `npm t` and your tests will run.  
There are several testing tools for Node.js. [AVA][ava] was used for this project. Once familiar with AVA, it's easy to quickly create tests.  
AVA was chosen because of it's asynchronous runtime, while also allowing tests to be run synchronously.
Other testing tools considered include [tape][tape] and [jest][jest].

The tests were run inside a [Docker][docker] container. This causes the tests to run in a consistent environment, negating the possibility of machine-based behavioural inconsistencies.
Running the tests in a Docker container also makes it easier to test the library on different versions of Node.js. It only requires a small modification in the Dockerfile to switch to a different version of Node.js.

## TEST SETUP
There are three types of tests in the library, mirroring the design of the library:
* unit tests;
* black box tests;
* integration test.

The unit tests are run on the helper classes, they make sure that the helper class returns an error on an incorrect helper class.

The black box based unit tests call certain functions within the library to make sure they run as expected. There are good- and bad-weather tests being run.

The integration test makes sure that all the functions previously tested in the black box tests are still working properly in the library's single connection point.

All examples will be based on the number lookup functionality of the library.

### UNIT TEST
[`number-lookup-unit-test.ts`](https://github.com/twizoapi/lib-api-node/src/tests/modelTests/number-lookup-unit-test.ts) will be the first test to come by. We will be looking at both the good-, and bad-weather status test. Because the `NumberLookup` class is there to catch errors early, there are more bad-weather tests than good-weather tests.
For the good-weather test we'll be looking at the largest of the two:
``` typescript
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
```
`t` is our test runner, it will run the test and return the result. All results are bundled, while the failed results will be displayed at the end of all the tests.
The `t.plan(2);` rule lets you set the amount of tests you expect to pass, in this case two. This way you can be sure that all your if-else clauses are working properly, and that one statement isn't being used more than it should.

All the functions within `NumberLookup` are being used here, to make sure the class works properly.
`t.true(...)` makes sure that a given statement return the value `true`. (there's also `t.false(...)` for statements that should return a false). The `num.isValid()` function returns if the NumberLookup created so far is a valid NumberLookup. This way a developer can check the validity of their created object.
Four numbers have been added to this `NumberLookup` through three different ways:
1) One in the constructor;
2) One through `num.addNumber(...)` ("number" implies single value);
3) Two through `num.addNumbers(...)` ("numbers" implies 1+ values).
All these additions are valid, so we expect the `numbers` array to be four numbers big.

Bad-weather test:
``` typescript
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
```
"resulType 3" is `Callback & polling`, meaning that you would like to receive your results through a callback, and that you would also like to be able to retrieve the results later through polling. But to make a callback, Twizo needs a url to call with your data.
In this case there has not been a `callbackUrl` added to the object, therefor the `NumberLookup` should not be valid.

### BLACK BOX TEST
[number-lookup-test](https://github.com/twizoapi/lib-api-node/src/tests/number-lookup-test.ts) will be the second test we look at.
Good-weather test:
``` typescript
//submitNr has been defined whilst creating the numberLookup
test("numberLookup status test", t => {
	t.plan(1);
	return numLookup.status(submitNr)
	.then(res => t.is(res.statusCode, 200))
  .catch(t.fail);
});
```
The `return` keyword is required to run asynchronous tests in AVA. `numLookup.status(submitNr)` calls the number lookup status endpoint. Because the `submitNr` has been defined before, we'll expect this function to return a `200` status code, along with some json. For this assumption `t.is(...)` should be used. This function will compare two submitted values. If the values do not match AVA will fail the test.  
In case of an error, `t.fail` has been called. This will make your test fail instantly.

Bad-weather test:
``` typescript
test("numberLookup status bad-weather test", t => {
	t.plan(1);
	return numLookup.status("fake_message_id")
	.then(res => t.is(res.statusCode, 404))
  .catch(t.fail);
});
```
The bad weather test looks very similar to the good weather test, the only difference is the value we pass to `numLookup.status`, and the expected outcome. Because `fake_message_id` is being send, we can expect a negative response from the server. In this case a `404` not found.


### INTEGRATION TEST
[index-test](https://github.com/twizoapi/lib-api-node/src/tests/indes-test.ts) will be our last test. This test only contains good-weather tests to make sure all the previously tested functionality will still be working once integrated in the main class.
``` typescript
//messageId has been saved earlier in the tests
test.serial("numberLookup status test", t => {
        t.plan(1);
        return numberLookup.status(messageId)
        .then(res => t.is(res.messageId, messageId))
        .catch(t.fail);
    });
```
With the knowledge of the earlier tests, This test is quite self explanatory.

## TEST RESULTS
While testing the results, there seemed to be an error in [`bioVoice.ts`](https://github.com/twizoapi/lib-api-node/src/rest_controllers/bioVoice.ts).
The problem only occurred after running the test more than once. The creation of the bio voice registration returned a `409` instead of a `200`, suggesting that the object already existed. My belief is that there is a problem with the `delete` call in the test API.
``` typescript
test.failing.serial("registration test", t => {
    t.plan(1);
    return registration("60123400000")
    .then(res => t.is(res.statusCode, 201))
    .catch(err => t.fail(err.message));
});
```
The test has been marked as failing within AVA by setting it as `test.failing.serial(...)`.

It was later confirmed that there is an issue within the test API, the error is therefore not related to this library.

### NODE.JS 8.10
The results for running the tests on Node.js 8.10 are:
``` bash
81 passed
3 known failures
    bio-voice-test › registration test
    bio-voice-test › registration status test
    bio-voice-test › subscription status test
```

### NODE.JS 6.14
The results for running the tests on Node.js 6.14 are:
``` bash
81 passed
3 known failures
    bio-voice-test › registration test
    bio-voice-test › registration status test
    bio-voice-test › subscription status test
```

### NODE.JS 4.9
The results for running the tests on Node.js 4.9 are:
``` bash
81 passed
3 known failures
    bio-voice-test › registration test
    bio-voice-test › registration status test
    bio-voice-test › subscription status test
```

### NODE.JS 0.12
The results for running the tests on Node.js are:
``` bash
/home/app/twizo-lib-nodejs/node_modules/ava/cli.js:3
const debug = require('debug')('ava');
^^^^^
SyntaxError: Use of const in strict mode.
    at exports.runInThisContext (vm.js:73:16)
    at Module._compile (module.js:443:25)
    at Object.Module._extensions..js (module.js:478:10)
    at Module.load (module.js:355:32)
    at Function.Module._load (module.js:310:12)
    at Function.Module.runMain (module.js:501:10)
    at startup (node.js:129:16)
    at node.js:814:3
npm ERR! Test failed.  See above for more details.
```
The syntax used in AVA is not recognized by Node.js 0.12.  
That does not mean, however, that Node.js 0.12 is not supported.
Further testing is required to test Node.js 0.12 compatibility, but since the library is aimed ad Node.js 6 and up, this has a low priority.



[twizo-lib]: https://www.npmjs.com/package/twizo
[npm]: https://www.npmjs.com/
[ava]: https://github.com/avajs
[tape]: https://github.com/substack/tape
[jest]: https://facebook.github.io/jest/
[docker]: https://www.docker.com/
