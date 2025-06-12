import crypto from "crypto";
import { razorpayInstance } from "../config/razarpay.js";
export const razorpayService = (total) => {
    return new Promise((resolve, reject) => {
        const options = {
            amount: total * 100,
            currency: "INR",
            receipt: "" + + Date.now(),
        };
        razorpayInstance.orders.create(options, (err, order) => {
            if (err) return reject(err);
            resolve(order);
        });
    });
};
export const verifyPayment = (orderId, paymentId, signature) => {
  const sign = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return sign === signature;
};
