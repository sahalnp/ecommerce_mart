import asyncHandler from "express-async-handler";
import { sendotp } from "../../utility/sendotp_email.js";

export const loadPasskey=asyncHandler(async(req,res)=>{
    if(req.session.pass){
       return res.render("admin/admin_login", { error: null });
    }
    return res.render('admin/admin_passkey',{error:null})
})

export const load_adminSignup = asyncHandler(async (req, res) => {
    if (req.session.admin) {
        return res.redirect("/admin/dashboard");
    }
    return res.render("admin/admin_signup", { error: null });
});

export const adminDashboard = asyncHandler(async(req, res) => {
    const results = await collection.find({ role: 0 });
    console.log(results.firstname);
    
    if (req.session.admin) {
        return res.render("admin/admin_dashboard", { user: results});
    }
    return res.redirect("/");
});
export const admin_Otp = asyncHandler(async (req, res) => {
        const generateotp = () => Math.floor(100000 + Math.random() * 90000);
        const otp =req.body.otp;
        req.session.sendotp=generateotp();
        await sendotp(req.session.admin.email,req.session.sendotp)
    if (req.session.admin) {
        return res.render("admin/admin_otp");
    } else {
        return res.redirect("/admin/login");
    }
});
