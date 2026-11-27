import { createHmac, timingSafeEqual } from "node:crypto";

function send(res, status, body) {
  res.status(status).json(body);
}

function getBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  return null;
}

export default async function verifyPayment(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "Method not allowed." });
  }

  if (process.env.PAYMENTS_ENABLED !== "true") {
    return send(res, 503, { error: "Online payments are not enabled for this marketplace." });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return send(res, 500, { error: "Razorpay is not configured on the server." });
  }

  const body = getBody(req);
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = body ?? {};
  if (
    typeof orderId !== "string" || !orderId ||
    typeof paymentId !== "string" || !paymentId ||
    typeof signature !== "string" || !/^[a-f\d]{64}$/i.test(signature)
  ) {
    return send(res, 400, { error: "razorpay_order_id, razorpay_payment_id, and razorpay_signature are required." });
  }

  const expected = createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest();
  const received = Buffer.from(signature, "hex");
  if (received.length !== expected.length || !timingSafeEqual(expected, received)) {
    return send(res, 400, { error: "Payment signature verification failed." });
  }

  return send(res, 200, { verified: true });
}
