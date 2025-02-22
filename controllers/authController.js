import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { sendotp } from "../utlity/sendotp_email.js";
import { settimer } from "../middleware/otp_timer.js";

// Controller for login
export const loginUser = async (req, res) => {
    const emailornumber = req.body.emailornumber;
    const password = req.body.password;
    if (!emailornumber) {
        return res.render("login", { user: "Email or number not be empty" });
    }
    if (!password) {
        return res.render("login", { user: "Password must be filled" });
    }
    const user = await User.findOne({
        $or: [{ email: emailornumber }, { number: parseInt(emailornumber) }],
    });
    req.session.user = user;

    console.log("user is ", req.session.user);
    req.session.user_emailornumber = emailornumber;

    if (!user) {
        return res.render("login", {
            user: "User does not exist. Please sign up.",
        }); //sending login page if user doesnot exist
    }

    // Compare the entered password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password); // user.password is the stored hashed password
    if (!passwordMatch) {
        return res.render("login", {
            user: "Incorrect password. Please try again.",
        }); //sending login page and sending a message passsword not coorect
    }
    return res.redirect("/");
};

// Controller for signup
export const signupUser = async (req, res, next) => {
    const { countryCode, number } = req.body;
    const fullPhoneNumber = `${countryCode}${number}`;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.session.users = {
        firstname: req.body.firstname,
        Lastname: req.body.lastname,
        email: req.body.email,
        number: fullPhoneNumber,
        password: hashedPassword,
    };
    req.session.email = req.session.users.email;
    req.session.newnumber = req.session.users.number;
    console.log(req.session.newnumber, "number");

    console.log(req.session.users);

    const existingUser = await User.findOne({
        email: req.session.users.email,
        number,
    });
    const existnumber = await User.findOne({
        number: req.session.users.number,
    });
    console.log(existingUser);

    //finding if user exist or not
    if (existingUser || existnumber) {
        return res.render("signup", { user: "User already exists" });
    } else {
        return res.redirect("/otp");
    }
};
export const send_otp = async (req, res, next) => {
    const otp = generateotp();
    req.session.otp = otp;
    await sendotp(req.session.email, otp); // Send OTP to user's email
    const now = new Date();
    req.session.otp_Expire = settimer(now);
    next();
};
const generateotp = () => Math.floor(100000 + Math.random() * 90000);
export const verifyotp = async (req, res) => {
    const { otp } = req.body;

    try {
        if (
            otp != req.session.otp ||
            new Date(req.session.otp_Expire) < new Date()
        ) {
            res.render("otp", {
                title: "OTP",
                error: "Invalid OTP: Please Try again",
                time: null,
            });
        } else {
            res.redirect("/phoneotp");
        }
    } catch (error) {
        console.log("The Error", error);
    }
};

export const logout = (req, res) => {
    if (req.session && (req.session.user || req.session.user_emailornumber)) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).send("Logout failed");
            }
            res.clearCookie("auth");
            console.log("User logged out");
            return res.redirect("/");
        });
    } else {
        return res.redirect("/");
    }
};

export const phoneverifyotp = async (req, res) => {
    try {
        if (
            req.session.phoneotp != req.body.otp ||
            new Date(req.session.otp_Expire) < new Date()
        ) {
            res.render("phoneotp", {
                phone: req.session.newnumber,
                error: "Invalid otp: Please try again",
                time: null,
            });
        } else{
            console.log("baluiiiiii")
            const newUser = await User.create(req.session.users);
            res.redirect("/login");
            console.log("create");
        }
           
        console.log(req.session.phone_otp_Expire);
    } catch (error) {
        console.log("Error verifying OTP", error);
    }
};

export const reset_verify = (req, res) => {
    const { otp } = req.body;

    try {
        if (otp !== req.session.reset_otp) {
            return res.render("otp", {
                title: "OTP",
                error: "Invalid OTP: Please try again",
            });
        }
        if (req.session.otp_Expire > new Date()) {
            return res.render("otp", {
                title: "OTP",
                error: "OTP Expired: Please try again",
            });
        } else {
            res.redirect("/resetpass");
        }
    } catch (error) {
        console.log("The Error:", error);
    }
};
export const email_check = async (req, res) => {
    const email_otp = generateotp();
    req.session.pass_otp = email_otp;
    const { email } = req.body;
    const exist_check = await User.findOne({ email: email });
    req.session.email_verify = email;

    if (!exist_check) {
        res.render("reset_pass_otp", {
            showOtpInput: null,
            error: "Email doesn't exist",
            email: null,
        });
    } else {
        await sendotp(email, email_otp);
        res.render("reset_pass_otp", {
            showOtpInput: "Pass",
            error: null,
            email: email,
        });
    }
};
export const reset_verify_otp = (req, res) => {
    if (req.session.pass_otp == req.body.otp) {
        res.redirect("/pass_reset");
    } else {
        res.render("reset_pass_otp", {
            showOtpInput: "pass",
            error: "Invalid OTP:Please try again",
            email: req.session.email_verify,
        });
    }
};
export const new_pass = async (req, res) => {
    const { password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate({ password: hashPassword });
    res.redirect("/login");
};
export const resend_otp_email = async (req, res) => {
    console.log(req.session.email);

    const resend_otp = generateotp();
    await sendotp(req.session.email, resend_otp);
    res.render("otp", { title: "OTP", error: null, time: "Pass" });
};
