import asyncHandler from "express-async-handler";
import { product } from "../../models/productModel.js";
import { User } from "../../models/userModel.js";
import { Cart } from "../../models/cartModel.js";
import { Compare } from "../../models/compareModel.js";


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
    const cartitems = await Cart.find();
    const cartProductIds = cartitems.map((item) => item.productId.toString());
    const find = await product.find().populate("image");
    const userfind = await User.findById(req.session.users._id);
    const productsWishlist = find.filter((product) => {
        return userfind.wishList.some(
            (id) => id.toString() === product._id.toString()
        );
    });

    return res.render("users/page/index", {
        username: req.session.userName,
        user: req.session.users,
        prod: latestProducts,
        cart: cartProductIds,
        wish: productsWishlist,
    });
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

export const loadProduct = asyncHandler(async (req, res) => {
    const UserId=req.session.users._id
    const productId=req.params.id
    const find = await product
        .findById(productId)
        .populate("image")
        .populate("brand");
    const percent = Math.floor(
        ((find.pricing.price - find.pricing.salePrice) / find.pricing.price) *
            100
    );
    const cartfind = await Cart.findOne({ UserId,productId });
    const cmp=await Compare.findOne({UserId,productId})
    
    const exist = await Cart.find({
        UserId,
        productId,
    });
    let show = false;
    if (exist.length > 0) {
        show = true;
    }
    req.session.productId=productId
    
    return res.render("users/page/productDetails", {
        username: req.session.userName,
        product: find,
        discount: percent,
        user: req.session.users,
        exist: show,
        cartItems: cartfind,
        cmp
    });
});
export const loadcart = asyncHandler(async (req, res) => {
    const cartItems = await Cart.find({ UserId: req.session.users._id });

    const productIds = cartItems.map((item) => item.productId);
    const productsInCart = await product
        .find({ _id: { $in: productIds } })
        .populate("image");

    const total = [];
    const prod = [];
    let deletedProducts = [];

    for (const item of cartItems) {
        const singleProduct = productsInCart.find(
            (p) => p._id.toString() === item.productId.toString()
        );

        if (singleProduct) {
            const value = item.quantity * singleProduct.pricing.salePrice;
            prod.push(singleProduct);
            total.push(value);
        } else {
            deletedProducts.push(item.productName || "A product in your cart");
        }
    }
    if (deletedProducts.length > 0) {
        req.session.alertMsg = deletedProducts;
    }

    const alertMsg = req.session.alertMsg || [];
    req.session.alertMsg = null;

    const subtotal = total.reduce((sum, curr) => sum + curr, 0);

    return res.render("users/page/cart", {
        username: req.session.userName,
        products: prod,
        subtotal,
        cartItems,
        user: req.session.users,
        total,
        alertMsg,
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
    const address = find.addresses.filter((addr) => addr.status === true);
    const cartfind = await Cart.find({ UserId: req.session.users._id });
    const productIds = cartfind.map((item) => item.productId); // Getting ids
    const products = await product
        .find({ _id: { $in: productIds } })
        .populate("image")
        .populate("brand"); //Getting products
    let prodtotal = 0;

    products.forEach((product, index) => {
        const quantity = cartfind[index]?.quantity || 0;
        const price = product.pricing?.salePrice || 0;
        prodtotal += price * quantity;
    });
    let tax = (5 / 100) * prodtotal;
    let ship = 0.0;
    if (prodtotal < 1800) {
        ship = 40.0;
        tax = (10 / 100) * prodtotal;
    }
    const total = prodtotal + tax + ship;
    return res.render("users/page/checkout", {
        username: req.session.userName,
        user: req.session.users,
        address: address,
        product: products,
        prodtotal: prodtotal.toFixed(2),
        ship: ship.toFixed(2),
        tax,
        total: total.toFixed(2),
        cart: cartfind,
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

    const prodIds = findProd.map((prod) => prod._id);
    const cartfind = await Cart.find({ productId: { $in: prodIds } });

    return res.render("users/page/whishlist", {
        username: req.session.userName,
        user: req.session.users,
        wishlist: findProd,
        cart: cartfind,
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
        address.status = false;
        await find.save();
        return res.redirect("/checkout");
    } else {
        return res.status(404).send("Address not found");
    } 
});
export const loadcmp = asyncHandler(async (req, res) => {
    const compare=await Compare.find()
    const productId = compare.map((item) => item.productId);
    const cmp = await product
    .find({ _id: { $in: productId } })
    .populate("brand")
    .populate("image");  
    const cart = await Cart.find({ productId: { $in: productId } });
    res.render("users/page/comparison", {
        username: req.session.userName,
        user: req.session.users,
        compare:cmp,
        inCart:cart
    });
});
export const loadtryOn=asyncHandler(async(req,res)=>{
    const find=await product.findById(req.session.productId).populate('image')
    res.render('users/page/virtual',{
        product:find
    })
})
