import { User } from "../../models/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { admin } from "../../models/adminModel.js";
import { Order } from "../../models/orderModel.js";
import { review } from "../../models/reviewModel.js";
import { banner } from "../../models/bannerModel.js";
import { imageModel } from "../../models/imageModel.js";
import { Coupon } from "../../models/couponModel.js";
import { wallet } from "../../models/walletModel.js";

export const profileEdit = asyncHandler(async (req, res) => {
    const { firstname, Lastname, email, number } = req.body;
    await admin.findByIdAndUpdate(req.params.id, {
        Fistname: firstname,
        Lastname,
        email,
        number,
    });
    return res.redirect("/admin/dashboard");
});

export const userEdit = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const value = await User.findById(id);
    let hashedPassword = value.password;

    if (req.body.password) {
        hashedPassword = await bcrypt.hash(req.body.password, 10);
    }

    await User.findByIdAndUpdate(
        { _id: id },
        {
            $set: {
                Firstname: req.body.firstname,
                Lastname: req.body.Lastname,
                email: req.body.email,
                number: req.body.number,
                password: hashedPassword,
                status: req.body.status,
            },
        },
        { new: true }
    );

    res.redirect("/admin/userDetails");
});
export const userDelete = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await User.findByIdAndUpdate(id, {
        isDlt: true,
        status: false,
    });
    res.redirect("/admin/userDetails");
});
export const adminDelete = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await admin.findByIdAndUpdate(id, {
        isDlt: true,
        status: false,
    });
    res.redirect("/admin/userDetails");
});
export const adminsEdit = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        const value = await admin.findById(id);
        let hashedPassword = value.password;
        if (req.body.password) {
            hashedPassword = await bcrypt.hash(req.body.password, 10);
        }
        const status = req.body.status === "on" ? true : false;

        const updated = await admin.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    Firstname: req.body.firstname,
                    Lastname: req.body.Lastname,
                    email: req.body.email,
                    number: req.body.number,
                    password: hashedPassword,
                    status,
                },
            },
            { new: true }
        );
        res.redirect("/admin/admins/details");
    } catch (error) {
        console.log(error);
    }
});

export const userStatus = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
    });
    res.redirect("/admin/userDetails");
});
export const userDashboardStatus = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
    });
    res.redirect("/admin/dashboard");
});
export const adminStatus = asyncHandler(async (req, res) => {
    await admin.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
    });
    res.redirect("/admin/admins/details");
});
export const editOrderStatus = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const redirectTo = req.body.redirectTo || "/admin/dashboard";

    await Order.findByIdAndUpdate(
        { _id: id },
        {
            status: req.body.status,
            paymentStatus: req.body.paymentStatus,
        },
        { new: true }
    );

    res.redirect(redirectTo);
});

export const editOrderPaymentStatus = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { paymentStatus, subtotal } = req.body;
    await Order.findByIdAndUpdate(
        { _id: id },
        { paymentStatus: paymentStatus },
        { new: true }
    );
    
    if (paymentStatus == "Refunded" ) {
        await wallet.findOneAndUpdate(
            {user:req.session.users._id},
            {
            balance: subtotal,
            },
            { new: true }
        ); 
    }
    res.redirect("/admin/orders");
});
export const reviewStatus = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await review.findByIdAndUpdate(
        { _id: id },
        { status: req.body.status },
        { new: true }
    );
    res.redirect("/admin/reviews");
});
export const bannerAdd = asyncHandler(async (req, res) => {
    const { title, description, status, productId, link } = req.body;
    const image = req.file?.filename;

    if (!image) {
        return res.status(400).json({ error: "No image uploaded." });
    }
    const basePath = `${req.protocol}://${req.get("host")}/uploads`;
    const savedImage = await imageModel.create({
        filename: image,
        filepath: `${basePath}/${image}`,
    });
    const exists = await banner.findOne({ title, description, status, link });

    if (!exists) {
        await banner.create({
            title,
            description,
            productId,
            status,
            link,
            image: savedImage._id,
        });
    } else {
        return res.render("admin/page/addBanner", {
            admin: req.session.admin,
            activePage: "AddBanner",
            error: "The banner already exist",
        });
    }
    return res.redirect("/admin/banners");
});
export const bannerStatus = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await banner.findByIdAndUpdate(
        { _id: id },
        { status: req.body.status },
        { new: true }
    );
    res.redirect("/admin/banners");
});
export const bannerDlt = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await banner.findByIdAndUpdate({ _id: id }, { isDlt: true }, { new: true });
    res.redirect("/admin/banners");
});
export const bannerEdit = asyncHandler(async (req, res) => {
    const { title, description, status, productId, link } = req.body;
    const image = req.file?.filename;
    const id = req.params.id;
    if (!image) {
        return res.status(400).json({ error: "No image uploaded." });
    }
    if (!productId) {
        productId == null;
    }

    const basePath = `${req.protocol}://${req.get("host")}/uploads`;
    const savedImage = await imageModel.create({
        filename: image,
        filepath: `${basePath}/${image}`,
    });
    await banner.findByIdAndUpdate(
        { _id: id },
        { title, description, status, productId, image: savedImage._id, link },
        { new: true }
    );
    res.redirect("/admin/banners");
});
export const bannerImgDlt = asyncHandler(async (req, res) => {
    const bannerId = req.body.id;

    const updated = await banner.findByIdAndUpdate(
        bannerId,
        { image: null },
        { new: true }
    );

    if (!updated) {
        return res
            .status(404)
            .json({ success: false, message: "Banner not found" });
    }

    res.json({ success: true, message: "Image deleted successfully" });
});
export const addCoupon = asyncHandler(async (req, res) => {
    const { code, discount, minAmount, maxDiscount, usageLimit } = req.body;
    const find = await Coupon.findOne({
        code,
        discount,
        minAmount,
        maxDiscount,
        usageLimit,
    });
    if (find) {
        return res.render("admin/page/couponAdd", {
            admin: req.session.admin,
            activePage: "couponManagement",
            error: "The Coupon already exist",
        });
    } else {
        await Coupon.create({
            code,
            discount,
            minAmount,
            maxDiscount,
            usageLimit,
        });
    }
    return res.redirect("/admin/coupons");
});
export const couponStatus = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await Coupon.findByIdAndUpdate(
        { _id: id },
        { active: req.body.status },
        { new: true }
    );
    res.redirect("/admin/coupons");
});
export const couponEdit = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { code, discount, minAmount, maxDiscount, expiry, usageLimit } =
        req.body;
    await Coupon.findByIdAndUpdate(
        { _id: id },
        { code, discount, minAmount, maxDiscount, expiry, usageLimit },
        { new: true }
    );
    res.redirect("/admin/coupons");
});
export const couponDlt = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await Coupon.findByIdAndUpdate({ _id: id }, { isDlt: true }, { new: true });
    res.redirect("/admin/coupons");
});
