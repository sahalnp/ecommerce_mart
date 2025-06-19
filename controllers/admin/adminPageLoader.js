import asyncHandler from "express-async-handler";
import { sendotp } from "../../utility/sendotp_email.js";
import { User } from "../../models/userModel.js";
import { admin } from "../../models/adminModel.js";
import { Order } from "../../models/orderModel.js";
import { review } from "../../models/reviewModel.js";
import { banner } from "../../models/bannerModel.js";
import { product } from "../../models/productModel.js";
import { Coupon } from "../../models/couponModel.js";

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
    const totalUsers = await User.find();
    const totalOrders = await Order.find();
    const totalProducts = await product.find();
    const completedOrders = await Order.find({ status: "Delivered" });
    const totalRevenue = completedOrders.reduce(
        (sum, order) => sum + order.total,
        0
    );
    const lowStockCount = await product.find({ inStock: { $lt: 2 } });
    const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("UserId");
    const razorpayCount = await Order.countDocuments({
        paymentMethod: { $in: ["razorpay", "wallet_razorpay"] },
    });
    const codCount = await Order.countDocuments({
        paymentMethod: { $in: ["cod", "wallet_cod"] },
    });
    const Users = await User.find().sort({ createdAt: -1 }).limit(5);
    const top = await Order.aggregate([
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.product",
                Sold: { $sum: "$items.quantity" },
            },
        },
        { $sort: { Sold: -1 } },
        { $limit: 5 },
    ]);
    const prod = await product.find().populate('image');
    const enrichedTopSelling = top.map(soldItem => {
        const product = prod.find(p => p._id.toString() === soldItem._id.toString());
        return {
            ...product.toObject(),
            sold: soldItem.Sold
        };
    });

    // Generate monthly statistics for the past 12 months
    const monthlyStats = await generateMonthlyStats();

    return res.render("admin/page/admin_dashboard", {
        totalUsers,
        totalOrders,
        lowStockCount,
        recentOrders,
        totalRevenue,
        razorpayCount,
        codCount,
        Users,
        topSelling: enrichedTopSelling,
        totalProducts,
        monthlyStats: JSON.stringify(monthlyStats), // Pass as JSON string
        admin: adminData,
        activePage: "admin_dashboard",
    });
});

// Helper function to generate monthly statistics
async function generateMonthlyStats() {
    const now = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = [];

    for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        
        const monthLabel = monthNames[date.getMonth()];
        
        // Count users created in this month
        const usersCount = await User.countDocuments({
            createdAt: {
                $gte: date,
                $lt: nextMonth
            }
        });

        // Count orders created in this month
        const ordersCount = await Order.countDocuments({
            createdAt: {
                $gte: date,
                $lt: nextMonth
            }
        });

        // Count products created in this month
        const productsCount = await product.countDocuments({
            createdAt: {
                $gte: date,
                $lt: nextMonth
            }
        });

        monthlyData.push({
            month: monthLabel,
            users: usersCount,
            orders: ordersCount,
            products: productsCount
        });
    }

    return monthlyData;
}
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
export const loadAdminEdit = asyncHandler(async (req, res) => {
    const result = await admin.findOne({ _id: req.params.id });
    return res.render("admin/page/adminEdit", {
        admins: result,
        admin: req.session.admin,
        activePage: "adminEdit",
    });
});
export const loadAdminDetails = asyncHandler(async (req, res) => {
    const adminData = await admin.findOne({ _id: req.session.admin._id });
    const admins = await admin.find({ role: 2 });
    return res.render("admin/page/adminManagement", {
        admins,
        admin: adminData,
        activePage: "adminManagement",
    });
});
export const loadOrder = asyncHandler(async (req, res) => {
    const orders = await Order.find()
        .populate("items.product")
        .populate("UserId");
    return res.render("admin/page/orderManagement", {
        orders,
        currentUrl: req.originalUrl,
        admin: req.session.admin,
        activePage: "orderManagement",
    });
});
export const viewOrder = asyncHandler(async (req, res) => {
    const viewOrder = await Order.findById(req.params.id)
        .populate({
            path: "items.product",
            populate: {
                path: "image",
                model: "image",
            },
        })
        .populate("UserId");
    const user = await User.findById(viewOrder.UserId._id);
    const address = user.addresses.find(
        (addr) => addr._id.toString() === viewOrder.billingAddress.toString()
    );
    res.render("admin/page/viewOrder", {
        viewOrder,
        address,
        redirectTo:
            req.query.from === "dashboard"
                ? "/admin/dashboard"
                : "/admin/orders",
        admin: req.session.admin,
        activePage: "orderManagement",
    });
});
export const viewProduct = asyncHandler(async (req, res) => {
    const prod = await product.findById(req.params.id).populate('image').populate('category').populate('brand')
    res.render("admin/page/viewProduct", {
        product:prod,
        admin: req.session.admin,
        activePage: "admin_dashboard",
    });
});
export const loadReview = asyncHandler(async (req, res) => {
    const rev = await review.find().populate("productId").populate("UserId");
    return res.render("admin/page/reviewManagement", {
        reviews: rev,
        admin: req.session.admin,
        activePage: "reviewManagement",
    });
});
export const loadBanner = asyncHandler(async (req, res) => {
    const banners = await banner.find().populate("productId").populate("image");
    return res.render("admin/page/bannerManagement", {
        banners,
        admin: req.session.admin,
        activePage: "bannerManagement",
    });
});
export const loadAddBanner = asyncHandler(async (req, res) => {
    const products=await product.find()
    return res.render("admin/page/addBanner", {
        products,
        admin: req.session.admin,
        activePage: "AddBanner",
        error: null,
    });
});
export const loadEditBanner = asyncHandler(async (req, res) => {
    const banners = await banner
        .findById(req.params.id)
        .populate("productId")
        .populate("image");
    const products = await product.find();
    return res.render("admin/page/editBanner", {
        banners,
        products,
        admin: req.session.admin,
        activePage: "AddBanner",
    });
});
export const loadCoupon = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find();
    return res.render("admin/page/couponManagement", {
        coupons,
        admin: req.session.admin,
        activePage: "couponManagement",
    });
});
export const loadAddCoupon = asyncHandler(async (req, res) => {
    return res.render("admin/page/couponAdd", {
        admin: req.session.admin,
        activePage: "couponManagement",
        error: null,
    });
});
export const loadEditCoupon = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const coupons = await Coupon.findById(id);
    return res.render("admin/page/couponEdit", {
        coupons,
        admin: req.session.admin,
        activePage: "couponManagement",
    });
});
export const loadLowStock = asyncHandler(async (req, res) => {
    const lowStockProducts = await product
        .find({ inStock: { $lt: 2 } })
        .populate("brand");
    res.render("admin/page/lowStock.ejs", {
        lowStockProducts,
        admin: req.session.admin,
        activePage: "admin_dashboard",
    });
});
