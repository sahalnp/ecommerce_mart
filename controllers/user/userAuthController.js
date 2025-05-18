import bcrypt from "bcrypt";
import { User } from "../../models/userModel.js";
import { sendotp } from "../../utility/sendotp_email.js";
import { settimer } from "../../middleware/otp_timerMiddleware.js";
import { forgetPassMail } from "../../utility/ForgotPassEmail.js";
import asyncHandler from "express-async-handler";

// Controller for login
export const loginUser = async (req, res) => {
    const {password,emailornumber} = req.body
    const user = await User.findOne({
        $or: [{ email: emailornumber }, { number: parseInt(emailornumber) }],
    });
    
    req.session.users = user;
    
    console.log("user is ",req.session.users );
    req.session.user_emailornumber = emailornumber;

    if (!user) {
        return res.render("users/Auth/login", {
            error: "User does not exist. Please sign up.",
        }); //sending login page if user doesnot exist
    }
    if(user.isDlt==true){
         return res.render("users/Auth/login", {
            error: "User was deleted by admin",
        }); 
    }

    // Compare the entered password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password); // user.password is the stored hashed password
    if (!passwordMatch) {
         req.flash('error', 'Incorrect password');
        return res.redirect('/login');
    }

    return res.redirect("/");
};

// Controller for signup
export const signupUser = async (req, res, next) => {
    const { countryCode, number } = req.body;
    const fullPhoneNumber = `${countryCode}${number}`;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.session.newUsers = {
        firstname: req.body.firstname,
        Lastname: req.body.lastname,
        email: req.body.email,
        number: fullPhoneNumber,
        password: hashedPassword,
    };


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
        return res.render("users/Auth/signup", { user: "User already exists" });
    } else {
        return res.redirect("/otp");
    }
};
const generateotp = () => Math.floor(100000 + Math.random() * 90000);
export const send_otp = async (req, res, next) => {

    req.session.otp = generateotp();

    
    await sendotp(req.session.users.email,req.session.otp); // Send OTP to user's email
    const now = new Date();
    req.session.otp_Expire = settimer(now);
    next();
};
export const verifyotp = async (req, res) => {
    const { otp } = req.body;

    try {
        if (
            otp != req.session.otp ||
            new Date(req.session.otp_Expire) < new Date()
        ) {
            res.render("users/Auth/otp", {
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
            return res.redirect("/login");
        });
    } else {
        return res.redirect("/");
    }
};

export const phoneverifyotp = async (req, res) => {

    try {
        if (
            parseInt(req.session.phoneotp) !== parseInt(req.body.otp) ||
            new Date(req.session.phone_otp_Expire) < new Date()
        ) {
            return res.render("users/Auth/phoneotp", {
                phone: req.session.users.number,
                error: "Invalid OTP: Please try again",
                time: null,
            });
        } else {
            await User.create(req.session.newUser);
            return res.redirect("/login");
        }
    } catch (error) {
        console.log("Error verifying OTP", error);
    }
};


export const email_check = async (req, res) => {
    const email_otp = generateotp();
    req.session.pass_otp = email_otp;
    const { email } = req.body;
    const exist_check = await User.findOne({ email: email });
    req.session.email_verify = email;

    if (!exist_check) {
        res.render("users/Auth/reset_pass_otp", {
            showOtpInput: null,
            error: "Email doesn't exist",
            email: null,
        });
    } else {
        await sendotp(email, email_otp);
        res.render("users/Auth/reset_pass_otp", {
            showOtpInput: "Pass",
            error: null,
            email: email,
        });
    }
};
export const reset_verify_otp = (req, res) => {
    if (req.session.pass_otp == req.body.otp) {
        res.redirect("/forgotPassword");
    } else {
        res.render("users/Auth/reset_pass_otp", {
            showOtpInput: "pass",
            error: "Invalid OTP:Please try again",
            email: req.session.email_verify,
        });
    }
};
export const new_pass = async (req, res) => {
    const { password } = req.body;
    
    const hashPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate({email:req.session.EMAIL},{  password: hashPassword }, { new: true });
    console.log(m,"dsfiodsjfoidsjhfl");
    
    res.redirect("/login");
};
export const resend_otp_email = async (req, res) => {
    console.log(req.session.users.email);
    const username=await User.findOne({email:req.session.users.email})
    console.log(username.firstname);
    const resetUrl=`${req.protocol}://${req.get('host')}/reset`;
    await forgetPassMail(req.session.users.email,resetUrl,username.firstname);
    res.render("users/Auth/otp", { title: "OTP", error: null, time: "Pass" });
};
export const resetPassEmail=asyncHandler(async(req,res)=>{
    const email=req.body.email
    const find = await User.findOne({email})
    req.session.EMAIL=email
    if (find){
        const resetUrl = `${req.protocol}://${req.get('host')}/forgotPassword`;
        forgetPassMail(email, resetUrl, `${find.firstname} ${find.lastname}`);
         return res.json({ exist: true });
    }
    else{
         return res.json({ exist: false });
    }
    
})