import asyncHandler from "express-async-handler";
import { sendotp } from "../../utility/sendotp_email.js";
import { User } from "../../models/userModel.js";
import { admin } from "../../models/adminModel.js";
import { Order } from "../../models/orderModel.js";
import { review } from "../../models/reviewModel.js";
import { banner } from "../../models/bannerModel.js";


export const loadPasskey = asyncHandler(async (req, res) => {
    if (req.session.pass) {
        return res.render("admin/Auth/admin_login", { error: null });
    }
    return res.render("admin/Auth/admin_passkey", { error: null });
});

export const load_adminSignup = asyncHandler(async (req, res) => {
    if (req.session.admin) {
        return res.redirect("/admin/dashboard");
    }
    return res.render("admin/Auth/admin_signup", { error: null });
});

export const admin_Otp = asyncHandler(async (req, res) => {
    if (req.session.admin) {
        const generateotp = () => Math.floor(100000 + Math.random() * 90000);
    req.session.sendotp = generateotp();
    console.log(req.session.sendotp);

    await sendotp(req.session.admin.email, req.session.sendotp);
        return res.render("admin/Auth/admin_otp", { message: null });
    }
    
    return res.redirect("/admin/login");
});

export const loadUser_Edit = asyncHandler(async (req, res) => {
        const result = await User.findOne({ _id: req.params.id });
        return res.render("admin/page/userEdit", {
            user: result,
            admin: req.session.admin,
            activePage: "userEdit",
        });
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
    return res.render("admin/page/admin_dashboard", {
        admin: adminData,
        activePage: "admin_dashboard",
    });
});
export const editAdmin = asyncHandler(async (req, res) => {
        return res.render("admin/page/adminProfile", {
            admin: req.session.admin,
            activePage: null,
        });

});
export const userDetails = asyncHandler(async (req, res) => {
    const adminData = await admin.findById(req.session.admin._id);
    const find = await User.find();

    return res.render("admin/page/userManagement", {
        user: find,
        admin: adminData,
        activePage: "userManagement",
    });
});
export const loadAdminEdit=asyncHandler(async(req,res)=>{
    const result = await admin.findOne({ _id: req.params.id });
    return res.render("admin/page/adminEdit", {
        admins: result,
        admin: req.session.admin,
        activePage: "adminEdit",
    });
})
export const loadAdminDetails=asyncHandler(async(req,res)=>{
    const adminData = await admin.findOne({ _id: req.session.admin._id });
    const admins=await admin.find({role:2})
        return res.render("admin/page/adminManagement", {
        admins,
        admin: adminData,
        activePage: "adminManagement",
    });
})
export const loadOrder=asyncHandler(async(req,res)=>{
    const orders=await Order.find().populate('items.product').populate('UserId')
        return res.render("admin/page/orderManagement", {
        orders,
        admin:  req.session.admin,
        activePage: "orderManagement",
    });
})
export const viewOrder=asyncHandler(async(req,res)=>{
    const viewOrder=await Order.findById(req.params.id).populate({
    path: 'items.product',
    populate: {
      path: 'image',
       model: 'image'  
    },
  }).populate('UserId')
    const user=await User.findById(viewOrder.UserId._id)
    const address = user.addresses.find(addr => addr._id.toString() === viewOrder.billingAddress.toString()); 
    res.render('admin/page/viewOrder',{
        viewOrder,
        address,
        admin:  req.session.admin,
        activePage: "orderManagement",
    })
})
export const loadReview=asyncHandler(async(req,res)=>{
    const rev=await review.find().populate('productId').populate('UserId')
        return res.render("admin/page/reviewManagement", {
        reviews:rev,
        admin:  req.session.admin,
        activePage: "reviewManagement",
    });
})
export const loadBanner=asyncHandler(async(req,res)=>{
    const banners=await banner.find().populate('productId')
        return res.render("admin/page/bannerManagement", {
        banners,
        admin:  req.session.admin,
        activePage: "bannerManagement",
    });
})
export const loadAddBanner=asyncHandler(async(req,res)=>{
        return res.render("admin/page/addBanner", {
        admin:  req.session.admin,
        activePage: "AddBanner",
    });
})
