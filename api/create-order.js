import Razorpay from "razorpay";

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

export default async function createOrder(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "Method not allowed." });
  }

  if (process.env.PAYMENTS_ENABLED !== "true") {
    return send(res, 503, { error: "Online payments are not enabled for this marketplace." });
  }

  const { RAZORPAY_KEY_ID: keyId, RAZORPAY_KEY_SECRET: keySecret } = process.env;
  if (!keyId || !keySecret) {
    return send(res, 500, { error: "Razorpay is not configured on the server." });
  }

  const body = getBody(req);
  const { amount, receipt, currency = "INR" } = body ?? {};
  if (!Number.isSafeInteger(amount) || amount < 100) {
    return send(res, 400, { error: "Amount must be an integer of at least 100 paise." });
  }
  if (typeof receipt !== "string" || !/^[A-Za-z0-9._-]{1,40}$/.test(receipt)) {
    return send(res, 400, { error: "A valid receipt of at most 40 characters is required." });
  }
  if (currency !== "INR") {
    return send(res, 400, { error: "Only INR payments are supported." });
  }

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({ amount, currency, receipt });
    return send(res, 200, { order_id: order.id, amount: order.amount, currency: order.currency });
  } catch (error) {
    const statusCode = error && typeof error === "object" && "statusCode" in error
      ? Number(error.statusCode)
      : 0;
    console.error("Razorpay order creation failed.", { statusCode });
    if (statusCode === 401) {
      return send(res, 401, { error: "Razorpay rejected the server credentials." });
    }
    return send(res, 500, { error: "We couldn't create a payment order. Please try again." });
  }
}
