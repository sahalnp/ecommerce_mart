    import { transporter } from "../config/sendMail.js"; // Import the Nodemailer transporter


    export function forgetPassMail(email,resetUrl,userName) {
    const mailOptions = {
        from: 'sahalnp60@gmail.com',
        to: email,
        subject: 'Password reset mail',
       html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <tr>
            <td align="center" bgcolor="#007bff" style="padding: 30px;">
              <h1 style="color: #ffffff; font-family: Arial, sans-serif;">Reset Your Password</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; font-family: Arial, sans-serif; color: #333;">
              <p>Hi <strong>${userName}</strong>,</p>
              <p>We received a request to reset your password. Click the button below to reset it:</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #007bff; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
              </p>
              <p>If you didn't request this, you can safely ignore this email.</p>
              <p style="margin-top: 40px;">Regards,<br/>The Craftopia Team</p>
            </td>
          </tr>
          <tr>
            <td align="center" bgcolor="#f4f4f4" style="padding: 20px; font-size: 0.85rem; color: #888;">
              &copy; ${new Date().getFullYear()} Craftopia. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        console.error('Error sending mail:', error);
        } else {
        console.log('mail sent:', info.response);
        }
    });
    }
