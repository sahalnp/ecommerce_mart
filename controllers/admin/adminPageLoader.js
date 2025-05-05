import asyncHandler from "express-async-handler";
import { sendotp } from "../../utility/sendotp_email.js";
import { User } from "../../models/userModel.js";
import { admin } from "../../models/adminModel.js";


export const loadPasskey = asyncHandler(async (req, res) => {
    if (req.session.pass) {
        return res.render("admin/Auth/admin_login", { error:null });
    }
    return res.render("admin/Auth/admin_passkey", { error:null });
});

export const load_adminSignup = asyncHandler(async (req, res) => {
    if (req.session.admin) {
        return res.redirect("/admin/dashboard");
    }
    return res.render("admin/Auth/admin_signup", { error:null });
});

export const admin_Otp = asyncHandler(async (req, res) => {
    
    if (req.session.admin) {
        return res.render("admin/Auth/admin_otp",{message:null});
    }
    const generateotp = () => Math.floor(100000 + Math.random() * 90000);
    
    req.session.sendotp = generateotp();
    console.log(req.session.sendotp);
    
    await sendotp(req.session.admin.email, req.session.sendotp);
    return res.redirect("/admin/login");
});

export const loadUser_Edit = asyncHandler(async (req, res) => {
    if (req.session.admin) {
        const result = await User.findOne({_id:req.params.id})
        return res.render("admin/page/userEdit", {
            user: result,
            admin: req.session.admin,
            activePage: 'userEdit'
        });
    }
    const userid = req.params.id;
    const result = await User.findOne({ _id: userid });
    const adminData = await admin.findOne({ _id: req.session.admin._id });
    return res.redirect("/admin/dashboard");
});
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
export const adminDashboard = asyncHandler(async (req, res) => {
    const adminData = await admin.findOne({ _id: req.session.admin._id });

    if (!req.session.admin) {
        return res.redirect("/admin/login");
    }
    return res.render("admin/page/admin_dashboard", { admin: adminData, activePage: 'admin_dashboard' });
});
export const editAdmin=asyncHandler(async(req,res)=>{

    if(req.session.admin){
        return res.render('admin/page/adminProfile',{
            admin:req.session.admin,
            activePage:null
            
        })
    return res.redirect('/admin/login')
    }
})
export const userDetails = asyncHandler(async (req, res) => {
    const adminData = await admin.findOne({ _id: req.session.admin._id });
    const results = await User.find({ role: 0 });
    if (!req.session.admin) {
        return res.redirect("/admin/login");
    }
    return res.render("admin/page/userManagement", {
        user: results,
        admin: adminData,
         activePage: 'userManagement'
    });
});

