import { admin } from "../../models/admin.js";
import { User } from "../../models/user.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

export const passkeySend = async (req, res, next) => {
    req.session.passkey = req.body.passkey;
    if (req.session.passkey == "0000") {
        req.session.pass=true
        if (req.session.admin) {
            return res.render("admin/Dashboard", { name: req.session.admin.name });
        }
        return res.render("admin/admin_login", { error: null });
    }
    return res.render("admin/admin_passkey", { error: "Invalid Passkey" });
};

export const admin_login = asyncHandler(async (req, res) => {
    const emailornumber = req.body.emailOrPhone;
    const password = req.body.password;

    // Validate if fields are filled
    if (!emailornumber) {
        return res.render("admin/admin_login", {
            admin: "Email or number must not be empty",
        });
    }
    if (!password) {
        return res.render("admin/admin_login", {
            admin: "Password must be filled",
        });
    }

    // Find admin in the database
    const adminDetails = await admin.findOne({
        $or: [{ email: emailornumber }, { number: parseInt(emailornumber) }],
    });

    // If admin not found
    if (!adminDetails) {
        return res.render("admin/admin_login", {
            admin: "Admin does not exist. Please sign up.",
        });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, adminDetails.password);
    
    if (!passwordMatch) {
        return res.render("admin/admin_login", {
            admin: "Incorrect password. Please try again.",
        });
    }

    // Store session and redirect
    req.session.admin = adminDetails;
    console.log("Admin is ", req.session.admin);

    return res.redirect("/admin/dashboard"); 
});

export const adminSignup = async (req, res) => {
    const { countryCode, number } = req.body;
    const fullPhoneNumber = `${countryCode}${number}`;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    const number_Exist ={
        user:await User.findOne({ number: req.body.number }),
        admin: await admin.findOne({ number: req.body.number })
    } 
    req.session.admin = {
        firstname: req.body.firstname,
        Lastname: req.body.lastname,
        role:2,
        email: req.body.email,
        number: fullPhoneNumber,
        password: hashedPassword,
    };
    
    const emailExist ={
        user_email:await User.findOne({ email: req.body.email }),
        admin_email: await admin.findOne({ email: req.body.email })

    } 
    if (number_Exist.user || number_Exist.admin) {
        return res.render("admin/admin_signup", {
            error: "The Number already registered",
        });
    }
    if (emailExist.user_email || emailExist.admin_email) {
        return res.render("admin/admin_signup", {
            error: "The Email already registered",
        });
    } else {
        res.redirect("/admin/otp");
    }
};

export const verify_adminOtp=asyncHandler(async(req,res)=>{
    const otp =req.body.otp
    if(otp==req.session.sendotp){
        await collection.create(req.session.admin);
        res.redirect('/admin/dashboard')
    }
     res.render('admin/admin_otp',{error:"Invalid OTP:Please try again"})
})

export const adminLogout = (req, res) => {
    if (req.session && (req.session.admin || req.session.admin_emailornumber)) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).send("Logout failed");
            }
            res.clearCookie("auth");
            console.log("User logged out");
            return res.redirect("/admin/login");
        });
    } else {
        return res.redirect("/admin/login");
    }
};

