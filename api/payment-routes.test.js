import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import createOrder from "./create-order.js";
import verifyPayment from "./verify-payment.js";

process.env.PAYMENTS_ENABLED = "true";
process.env.RAZORPAY_KEY_ID = "test-key-id";
process.env.RAZORPAY_KEY_SECRET = "test-key-secret";

function responseStub() {
  return {
    statusCode: 0,
    headers: {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(name, value) {
      this.headers[name] = value;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

async function invoke(handler, body) {
  const res = responseStub();
  await handler({ method: "POST", body }, res);
  return res;
}

test("payment endpoints stay disabled unless explicitly enabled", async () => {
  process.env.PAYMENTS_ENABLED = "false";
  const createRes = await invoke(createOrder, { amount: 100, receipt: "booking-1" });
  const verifyRes = await invoke(verifyPayment, {});
  assert.equal(createRes.statusCode, 503);
  assert.equal(verifyRes.statusCode, 503);
  process.env.PAYMENTS_ENABLED = "true";
});

test("create-order rejects amounts below 100 paise", async () => {
  const res = await invoke(createOrder, { amount: 99, receipt: "booking-1" });
  assert.equal(res.statusCode, 400);
});

test("verify-payment rejects missing fields", async () => {
  const res = await invoke(verifyPayment, { razorpay_order_id: "order-1" });
  assert.equal(res.statusCode, 400);
});

test("verify-payment accepts a matching HMAC and rejects a mismatch", async () => {
  const orderId = "order-1";
  const paymentId = "payment-1";
  const signature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const valid = await invoke(verifyPayment, {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  });
  assert.equal(valid.statusCode, 200);
  assert.deepEqual(valid.body, { verified: true });

  const invalid = await invoke(verifyPayment, {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: "0".repeat(64),
  });
  assert.equal(invalid.statusCode, 400);
});
