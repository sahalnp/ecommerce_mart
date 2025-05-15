import asyncHandler from "express-async-handler";
import { product } from "../../models/productModel.js";
import { User } from "../../models/userModel.js";
import { Cart } from "../../models/cartModel.js";

export const home = asyncHandler(async (req, res) => {
    const latestProducts = await product
        .find()
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("image")
        .populate("brand");

    if (req.session.users && req.session.users.isDlt == true) {
        let username =
            req.session.users.firstname + " " + req.session.users.Lastname;
        req.session.userName = req.session.user_name || username;

        return res.render("users/page/index", {
            username: req.session.userName,
            user: req.session.users,
            prod: latestProducts,
        });
    }

    return res.render("users/page/index", {
        username: null,
        user: null,
        prod: latestProducts,
    });
});

export const loadEditProfile = asyncHandler(async (req, res) => {
    if (req.session.users) {
        return res.render("users/profileEdit", {
            user: req.session.users,
            username: req.session.userName,
        });
    }
    return res.redirect("/login");
});

export const laodShop = asyncHandler(async (req, res) => {
    if (req.session.users) {
        const find = await product.find().populate("image");
        const userfind = await User.findById(req.session.users._id);
        // change wishlist id to string to check and add a new new field(wish) to product model and assing true or false
        const productsWishlist = find.filter((product) => {
            return userfind.wishList.some(
                (id) => id.toString() === product._id.toString()
            );
        });
        const cartfind = await Cart.find({ UserId: req.session.users._id });

        return res.render("users/page/shop", {
            username: req.session.userName,
            product: find,
            user: req.session.users,
            wish: productsWishlist,
            cartItems: cartfind,
        });
    }
    return res.redirect("/login");
});

export const laodProduct = asyncHandler(async (req, res) => {
    if (req.session.users) {
        const find = await product
            .findById(req.params.id)
            .populate("image")
            .populate("brand");
        const percent = Math.floor(
            ((find.pricing.price - find.pricing.salePrice) /
                find.pricing.price) *
                100
        );
        const exist = await Cart.find({
            UserId: req.session.users._id,
            productId: req.params.id,
        });
        let show = false;

        if (exist.length > 0) {
            show = true;
        }
        return res.render("users/page/productDetails", {
            username: req.session.userName,
            product: find,
            discount: percent,
            cart: "Add to Cart",
            user: req.session.users,
            exist: show,
        });
    }
});
export const loadcart = asyncHandler(async (req, res) => {
    if (req.session.users) {
        const find = await Cart.find({ UserId: req.session.users._id });
        const total = [];
        const prod = [];
        for (let i = 0; i < find.length; i++) {
            const singleProduct = await product
                .findById(find[i].productId)
                .populate("image");
            const value = find[i].quantity * singleProduct.pricing.salePrice;
            prod.push(singleProduct);
            total.push(value);
        }
        
        const subtotal = total.reduce((sum, curr) => sum + curr, 0);
        return res.render("users/page/cart", {
            username: req.session.userName,
            products: prod,
            subtotal: subtotal,
            cartItems: find,
            user: req.session.users,
            total
        });
    }
});
export const about = asyncHandler(async (req, res) => {
    if (req.session.users) {
        return res.render("users/page/about", {
            username: req.session.userName,
            user: req.session.users,
        });
    }
});
export const blog = asyncHandler(async (req, res) => {
    if (req.session.admin) {
        return res.render("users/page/blog", {
            username: req.session.userName,
            user: req.session.users,
        });
    }
});
export const blogDetails = asyncHandler(async (req, res) => {
    if (req.session.users) {
        return res.render("users/page/blog-details", {
            username: req.session.userName,
            user: req.session.users,
        });
    }
});

export const confirmaton = asyncHandler(async (req, res) => {
    if (req.session.users) {
        return res.render("users/page/confirmation", {
            username: req.session.userName,
            user: req.session.users,
        });
    }
});
export const checkout = asyncHandler(async (req, res) => {
    if (req.session.users) {
        return res.render("users/page/checkout", {
            username: req.session.userName,
            user: req.session.users,
        });
    }
});
export const contact = asyncHandler(async (req, res) => {
    if (req.session.users) {
        return res.render("users/page/contact", {
            username: req.session.userName,
            user: req.session.users,
        });
    }
    res.redirect("/login");
});
export const wishlist = asyncHandler(async (req, res) => {
    if (req.session.users) {
        const find = await User.findById(req.session.users._id).populate(
            "wishList"
        );

        const findProd = await product
            .find({ _id: find.wishList })
            .populate("image");

        return res.render("users/page/whishlist", {
            username: req.session.userName,
            user: req.session.users,
            wishlist: findProd,
        });
    }
});
