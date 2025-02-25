import { transporter } from "../config/sendMail.js";
export const sendotp = async (email, otp) => {
    try {
        const auth = await transporter.sendMail({
            from: process.env.APP_EMAIL,
            to: email,
            subject: "OTP",
            text: `YOUR OTP TO ENTER THE M4 MART IS: ${otp}`,
        });
        console.log("OTP Email sent: " + otp);
    } catch (error) {
        console.log("Error sending OTP email:", error);
    }
};
