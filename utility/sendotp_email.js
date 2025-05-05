import { transporter } from "../config/sendMail.js";

const generateOtpHtml = (otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Your OTP for M4 Mart</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 20px;
            color: #333;
          }
          .container {
            background-color: #ffffff;
            max-width: 500px;
            margin: auto;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .otp {
            font-size: 24px;
            font-weight: bold;
            color: #2a9d8f;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #999;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Welcome to M4 Watch!</h2>
          <p>Use the OTP below to verify your identity and continue:</p>
          <div class="otp">${otp}</div>
          <p>This OTP is valid for 1 minutes. Please do not share it with anyone.</p>
          <div class="footer">
            &copy; ${new Date().getFullYear()} M4 Mart. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
};

export const sendotp = async (email, otp) => {
  try {
    const auth = await transporter.sendMail({
      from: process.env.APP_EMAIL,
      to: email,
      subject: "Your OTP for M4 Mart",
      text: `YOUR OTP TO ENTER THE M4 MART IS: ${otp}`,
      html: generateOtpHtml(otp), // ✅ Added HTML version
    });
    console.log("OTP Email sent: " + otp);
  } catch (error) {
    console.log("Error sending OTP email:", error);
  }
};
