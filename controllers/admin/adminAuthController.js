import { admin } from "../../models/adminModel.js";
import { User } from "../../models/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
export const passkeySend = async (req, res) => {
    req.session.passkey = req.body.passkey;
    
    if (req.session.passkey == "0000") {
        req.session.pass = true;
        console.log(req.session.admin);
        
        if (req.session.admin) {
            return res.render("admin/page/admin_dashboard", {
                admin: req.session.admin,
            });
        }
    return res.redirect('/admin/login')
    }
    return res.render("admin/Auth/admin_passkey", { error: "Invalid Passkey" });
};
export const admin_login = asyncHandler(async (req, res) => {
    const {password,EmailORNumber} = req.body;
    // Find admin in the database
    const adminDetails = await admin.findOne({
        $or: [{ email: EmailORNumber }, { number: parseInt(EmailORNumber) }],
    });
    
    // If admin not found
    if (!adminDetails) {
        return res.render("admin/Auth/admin_login", {
            error: "Admin does not exist. Please sign up.",
        });
    }
    if(adminDetails.status==false){
         return res.render("admin/Auth/admin_login", {
            error: "Admin was deleted by superAdmin",
        });
    }
    // Compare password
    const passwordMatch = await bcrypt.compare(password, adminDetails.password);
    
    if (!passwordMatch) {
        return res.render("admin/Auth/admin_login", {
            error: "Incorrect password. Please try again.",
        });
    }
    // Store session and redirect
    req.session.admin = adminDetails;
    return res.redirect("/admin/dashboard");
});

export const adminSignup = async (req, res) => {
    const { country_code, number } = req.body;
    const fullPhoneNumber = `${country_code}${number}`;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const number_Exist = {
        user: await User.findOne({ number: req.body.number }),
        admin: await admin.findOne({ number: req.body.number }),
    };
    req.session.admin = {
        Firstname: req.body.firstname,
        Lastname: req.body.lastname,
        role: 2,
        email: req.body.email,
        number: fullPhoneNumber,
        password: hashedPassword,
        status:true,
        isDlt:false,
    };

    const emailExist = {
        user_email: await User.findOne({ email: req.body.email }),
        admin_email: await admin.findOne({ email: req.body.email }),
    };
    if (number_Exist.user || number_Exist.admin) {
        return res.render("admin/Auth/admin_signup", {
            error: "The Number already registered",
        });
    }
    if (emailExist.user_email || emailExist.admin_email) {
        return res.render("admin/Auth/admin_signup", {
            error: "The Email already registered",
        });
    } else {    
        res.redirect("/admin/otp");
    }
};

export const verify_adminOtp = asyncHandler(async (req, res) => {
    const { otp } = req.body;
    if (otp == req.session.sendotp) {
        await admin.create(req.session.admin);
        res.redirect("/admin/login");
    }
    res.render("admin/Auth/admin_otp", { message: "Invalid OTP:Please try again" });
});


