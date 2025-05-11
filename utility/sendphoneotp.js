import twilio from "twilio";
import dotenv from "dotenv";
import { settimer } from "../middleware/otp_timerMiddleware.js";
dotenv.config();

const client = new twilio(
    process.env.TWILIO_ACC_SID,
    process.env.TWILIO_AUTH_TOKEN
);
const phoneGenerateOtp = () => Math.floor(100000 + Math.random() * 900000);

export const sendsms = async (req, res, next) => {
    req.session.phoneotp = phoneGenerateOtp();
    console.log("The OTP sent to phone:", req.session.phoneotp);

    req.session.phone_otp_Expire = settimer(new Date());
    console.log(req.session.phone_otp_Expire);

    const msgoption = {
        from: process.env.TWILIO_NUMBER,
        to: req.session.newnumber,
        body: `Your OTP is: ${req.session.phoneotp}`,
    };

    try {
        const sms = await client.messages.create(msgoption);
        console.log("The message is ", sms);
    } catch (error) {
        console.error("The error is ", error);
        return res.status(500).json({ message: "Failed to send OTP" });
    }

    next();
};
