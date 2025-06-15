import asyncHandler from "express-async-handler";
import { product } from "../../models/productModel.js";
import { User } from "../../models/userModel.js";
import { Cart } from "../../models/cartModel.js";
import { Compare } from "../../models/compareModel.js";
import { Order } from "../../models/orderModel.js";
import { brandModel } from "../../models/brandModel.js";
import { review } from "../../models/reviewModel.js";
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
    const user = await User.findById(req.session.users._id);
    return res.render("users/page/profile", {
        user,
        username: req.session.userName,
    });
});
export const loadchangePass = asyncHandler(async (req, res) => {
    const user = await User.findById(req.session.users._id);
    return res.render("users/page/changePass", {
        user,
        username: req.session.userName,
    });
});
export const loadProfileAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.session.users._id);

    return res.render("users/page/addressDetail", {
        user,
        username: req.session.userName,
        addressArray: user.addresses,
    });
});
export const editAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.session.users._id);
    const address = user.addresses.find(
        (addr) => addr._id.toString() === req.params.id
    );
    return res.render("users/page/editAddress", {
        user,
        username: req.session.userName,
        address,
    });
});

export const loadWallet = asyncHandler(async (req, res) => {
    const user = await User.findById(req.session.users._id);
    return res.render("users/page/wallet", {
        user,
        username: req.session.userName,
    });
});

export const laodShop = asyncHandler(async (req, res) => {
    const find = await product
        .find()
        .populate("image")
        .populate("brand")
        .populate("category");
    
    
    const userfind = await User.findById(req.session.users._id);
    const productsWishlist = find.filter((product) => {
        return userfind.wishList.some(
            (id) => id.toString() === product._id.toString()
        );
    });
    const mat = [...new Set(find.map((p) => p.bandMaterial))];
    const cartfind = await Cart.find({ UserId: req.session.users._id });
    const brand = [...new Set(find.map((p) => p.brand.name))];
    const cat = [...new Set(find.flatMap((p) => Array.isArray(p.category) ? p.category.map((c) => c.name) : []   ) ),];
    const shape = [...new Set(find.map((p) => p.caseShape))];
  const rev = await review.aggregate([
    {
        $group: {
            _id: "$productId",
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 }
        }
    }
    ]);
    const productWithRatings = find.map(prod => {
            const ratingData = rev.find(r => r._id.toString() === prod._id.toString());
            return {
                ...prod.toObject(),
                averageRating: ratingData ? ratingData.averageRating : 0,
                totalReviews: ratingData ? ratingData.totalReviews : 0
            };
        });
        
        


    return res.render("users/page/shop", {
        username: req.session.userName,
        product: productWithRatings,
        user: req.session.users,
        wish: productsWishlist,
        cartItems: cartfind,
        mat,
        brand,
        cat,
        shape,
        rev
    });
});

export const loadProduct = asyncHandler(async (req, res) => {
    const UserId = req.session.users._id;
    const productId = req.params.id;
    const find = await product
        .findById(productId)
        .populate("image")
        .populate("brand");
    const percent = Math.floor(
        ((find.pricing.price - find.pricing.salePrice) / find.pricing.price) *
            100
    );
    const value = await product.findById(productId);
    const cartfind = await Cart.findOne({ UserId, productId });
    const cmp = await Compare.findOne({ UserId, productId });
    if (cartfind) {
        if (cartfind.quantity > value.inStock) {
            await Cart.findOneAndUpdate(
                { UserId: req.session.users._id, productId: value._id },
                { quantity: value.inStock },
                { new: true }
            );
        }
    }
    const reviews = await review.find({ productId: find._id,status:"Accepted" });
    let star = 0;
    reviews.forEach((d) => {
        star += d.rating;
    });
    const averageRating =
        reviews.length > 0 ? (star / reviews.length).toFixed(1) : 0;

    const exist = await Cart.find({
        UserId,
        productId,
    });
    let show = false;
    if (exist.length > 0) {
        show = true;
    }
    return res.render("users/page/productDetails", {
        username: req.session.userName,
        product: find,
        discount: percent,
        user: req.session.users,
        exist: show,
        cartItems: cartfind,
        cmp,
        totalUser: reviews.length,
        avg: averageRating,
    });
});
export const loadcart = asyncHandler(async (req, res) => {
    const cartItems = await Cart.find({
        UserId: req.session.users._id,
        quantity: { $gt: 0 },
    });
    const productIds = cartItems.map((item) => item.productId);

    const productsInCart = await product
        .find({ _id: { $in: productIds } })
        .populate("image");
    for (let i = 0; i < productIds.length; i++) {
        const prod = await product.findById(productIds[i]);
        if (prod.inStock <= 0) {
            await Cart.findOneAndDelete({ productId: productIds[i] });
        } else if (prod.inStock > 0 && prod.inStock <= 10) {
            await Cart.findOneAndUpdate(
                { UserId: req.session.users._id, productId: productIds[i] },
                { quantity: prod.inStock },
                { new: true }
            );
        }
    }

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
    const productIds = cartfind.map((item) => item.productId);
    const products = await product
        .find({
            _id: { $in: productIds },
            inStock: { $gt: 0 },
        })
        .populate("image")
        .populate("brand");
    let prodtotal = 0;
    cartfind.forEach((prd) => {
        const matchingProduct = products.find(
            (p) => p._id.toString() === prd.productId.toString()
        );

        if (matchingProduct) {
            if (prd.quantity > matchingProduct.inStock)
                prd.quantity = matchingProduct.inStock;
        }
    });

    products.forEach((product, index) => {
        const quantity = cartfind[index]?.quantity || 0;
        const price = product.pricing?.salePrice || 0;
        prodtotal += price * quantity;
    });

    let tax = 0;
    let ship = 0;

    if (prodtotal < 2000) {
        ship = 40.0;
        tax = (20 / 100) * prodtotal;
    } else {
        tax = (12 / 100) * prodtotal;
    }

    const total = prodtotal + tax + ship;
    for (let i = 0; i < productIds.length; i++) {
        const prod = await product.findById(productIds[i]);
        if (prod.inStock <= 0) {
            await Cart.findOneAndDelete({ productId: productIds[i] });
        } else if (prod.inStock > 0 && prod.inStock <= 10) {
            await Cart.findOneAndUpdate(
                { UserId: req.session.users._id, productId: productIds[i] },
                { quantity: prod.inStock },
                { new: true }
            );
        }
    }
    const key = process.env.KEY_ID;
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
        key,
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
    const compare = await Compare.find();
    const productId = compare.map((item) => item.productId);
    const cmp = await product
        .find({ _id: { $in: productId } })
        .populate("brand")
        .populate("image");
    const cart = await Cart.find({ productId: { $in: productId } });
    res.render("users/page/comparison", {
        username: req.session.userName,
        user: req.session.users,
        compare: cmp,
        inCart: cart,
    });
});
export const loadtryOn = asyncHandler(async (req, res) => {
    const find = await product.findById(req.params.id).populate("vrImage");
    res.render("users/page/virtual", {
        product: find,
    });
});
export const loadOrderPlace = asyncHandler(async (req, res) => {
    const order = await Order.findOne({
        UserId: req.session.users._id,
        OrderId: req.session.OrderId,
    }).populate("UserId");
    const user = await User.findById(req.session.users._id);
    const fullAddress = user.addresses.find(
        (addr) => addr._id.toString() === order.billingAddress.toString()
    );

    res.render("users/page/placeOrder", {
        username: req.session.userName,
        user: req.session.users,
        order,
        fullAddress,
    });
});
export const myOrder = asyncHandler(async (req, res) => {
    const orders = await Order.find({ UserId: req.session.users._id }).populate(
        {
            path: "items.product",
            populate: [
                { path: "brand", model: "brand" },
                { path: "image", model: "image" },
            ],
        }
    );

    res.render("users/page/MyOrder", {
        username: req.session.userName,
        user: req.session.users,
        orders,
    });
});

export const orderDetails = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate("UserId")
        .populate("items.product")
        .populate({
            path: "items.product",
            populate: [
                { path: "brand", model: "brand" },
                { path: "image", model: "image" },
            ],
        });
    const billingAddress = order.UserId.addresses.find(
        (addr) => addr._id.toString() === order.billingAddress.toString()
    );

    res.render("users/page/viewOrder", {
        username: req.session.userName,
        user: req.session.users,
        order,
        Address: billingAddress,
    });
});

export const loadReview = asyncHandler(async (req, res) => {
    const prod = await product
        .findById(req.params.id)
        .populate("image")
        .populate("brand");
    const rev = await review.find({ productId: prod._id,status:"Accepted" }).populate("UserId");
    let avg = 0;
    if (rev.length > 0) {
        const total = rev.reduce((sum, r) => sum + r.rating, 0);
        avg = Math.round((total / rev.length) * 10) / 10;
    }
    let data = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    };
    rev.forEach((r) => {
        const rating = Math.floor(r.rating);
        if (data[rating] !== undefined) {
            data[rating]++;
        }
    });

    res.render("users/page/review", {
        username: req.session.userName,
        user: req.session.users,
        prod,
        reviews: rev,
        avg,
        data,
    });
});
export const loadWriteRev = asyncHandler(async (req, res) => {
    const prod = await product.findById(req.params.id).populate("image");
    const order = await Order.findOne({
        UserId: req.session.users._id,
        "items.product": prod._id,
    });
    res.render("users/page/writeReview", {
        username: req.session.userName,
        user: req.session.users,
        prod,
        order,
    });
});
