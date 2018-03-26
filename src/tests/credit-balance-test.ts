import test from "ava";
import { getBalance } from "../rest_controllers/creditBalance";

require("dotenv").config();

test("get balance test", t => {
    t.plan(1);
    return getBalance()
    .then(res => t.is(res.statusCode, 200))
    .catch(err => t.fail(err.message));
});