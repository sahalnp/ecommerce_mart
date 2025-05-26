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
    let username =
        req.session.users.firstname + " " + req.session.users.Lastname;
    req.session.userName = req.session.user_name || username;

    return res.render("users/page/index", {
        username: req.session.userName,
        user: req.session.users,
        prod: latestProducts,
    });

    // return res.render("users/page/index", {
    //     username: null,
    //     user: null,
    //     prod: latestProducts,
    // });
});

export const loadProfile = asyncHandler(async (req, res) => {
    return res.render("users/page/profile", {
        user: req.session.users,
        username: req.session.userName,
    });
});

export const laodShop = asyncHandler(async (req, res) => {
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
});

export const laodProduct = asyncHandler(async (req, res) => {
    const find = await product
        .findById(req.params.id)
        .populate("image")
        .populate("brand");
    const percent = Math.floor(
        ((find.pricing.price - find.pricing.salePrice) / find.pricing.price) *
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
});
export const loadcart = asyncHandler(async (req, res) => {
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
        total,
    });
});
export const about = asyncHandler(async (req, res) => {
    return res.render("users/page/about", {
        username: req.session.userName,
        user: req.session.users,
    });
});
export const blog = asyncHandler(async (req, res) => {
    return res.render("users/page/blog", {
        username: req.session.userName,
        user: req.session.users,
    });
});
export const blogDetails = asyncHandler(async (req, res) => {
    return res.render("users/page/blog-details", {
        username: req.session.userName,
        user: req.session.users,
    });
});

export const confirmaton = asyncHandler(async (req, res) => {
    return res.render("users/page/confirmation", {
        username: req.session.userName,
        user: req.session.users,
    });
});
export const loadCheckout = asyncHandler(async (req, res) => {
   const find = await User.findOne({ _id: req.session.users._id });
   const address = find.addresses.filter(addr => addr.status === true);
   const cartfind = await Cart.find({ UserId: req.session.users._id });
   console.log(cartfind);
   const productIds = cartfind.map(item => item.productId); // Getting ids

   const products = await product.find({ _id: { $in: productIds } }); //Getting products
   console.log(products,"dfghjk");
   
    return res.render("users/page/checkout", {
        username: req.session.userName,
        user: req.session.users,
        address: address,
        product:products
    });
});
export const contact = asyncHandler(async (req, res) => {
    return res.render("users/page/contact", {
        username: req.session.userName,
        user: req.session.users,
    });
});
export const wishlist = asyncHandler(async (req, res) => {
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
});
export const loadAddress = asyncHandler(async (req, res) => {
    res.render("users/page/address", {
        username: req.session.userName,
        user: req.session.users,
        error: null,
    });
});
export const dltAddress = asyncHandler(async (req, res) => {
    console.log(req.params.id);
    const find = await User.findById(req.session.users._id);
    const address = find.addresses.id(req.params.id);
    if (address) {
        address.status = "unlist";
        await find.save();
        res.redirect("/checkout");
    } else {
        res.status(404).send("Address not found");
    }

    res.redirect("/checkout");
});
