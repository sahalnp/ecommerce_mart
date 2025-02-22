import twilio from "twilio";
import dotenv from "dotenv";
import { settimer } from "../middleware/otp_timer.js";
dotenv.config();

const client = new twilio(
    process.env.TWILIO_ACC_SID,
    process.env.TWILIO_AUTH_TOKEN
);
const phoneGenerateOtp = () => Math.floor(100000 + Math.random() * 900000);
const now = new Date();

export const sendsms = async (req, res,next) => {
    req.session.phoneotp = phoneGenerateOtp();
    console.log("The otp send to phone:", req.session.phoneotp)
    req.session.phone_otp_Expire = settimer(now);
    console.log(req.session.phone_otp_Expire);
    const new_number = req.session.newnumber;
    const msgoption = {
        from: process.env.TWILIO_NUMBER,
        to: new_number,
        body: `Your OTP is: ${req.session.phoneotp}`,
    };
    try {
        const sms = await client.messages.create(msgoption);
        console.log("The message is ", sendsms);
    } catch (error) {
        console.log("the error is ", error);
    }
    next();
};
