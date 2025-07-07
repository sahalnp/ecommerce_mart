import asyncHandler from "express-async-handler";
import { product } from "../../models/productModel.js";
import { User } from "../../models/userModel.js";
import { Cart } from "../../models/cartModel.js";
import { Compare } from "../../models/compareModel.js";
import { Order } from "../../models/orderModel.js";
import { review } from "../../models/reviewModel.js";
import { banner } from "../../models/bannerModel.js";
import { wallet } from "../../models/walletModel.js";
import { transaction } from "../../models/transactionModel.js";
export const home = asyncHandler(async (req, res) => {
    const latestProducts = await product
        .find()
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("image")
        .populate("brand");
    let username =
        req.session.users.firstname + " " + req.session.users.Lastname;
    const banners = await banner.find({ status: "active" }).populate("image");
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
        username: userfind.firstname.trim() + " " + userfind.Lastname.trim(),
        user:userfind,
        prod: latestProducts,
        cart: cartProductIds,
        wish: productsWishlist,
        banners,
    });
});

export const loadProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.session.users._id);
    return res.render("users/page/profile", {
        user,
        username: user.firstname.trim() + " " + user.Lastname.trim(),
    });
});
export const loadchangePass = asyncHandler(async (req, res) => {
    const user = await User.findById(req.session.users._id);
    return res.render("users/page/changePass", {
        user,
        username: user.firstname.trim() + " " + user.Lastname.trim(),
    });
});
export const loadProfileAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.session.users._id);
    return res.render("users/page/addressDetail", {
        user,
        username: user.firstname.trim() + " " + user.Lastname.trim(),
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
        username: user.firstname.trim() + " " + user.Lastname.trim(),
        address,
    });
});

export const loadWallet = asyncHandler(async (req, res) => {
    const user = await User.findById(req.session.users._id);
    const wlt = await wallet.findOne({ user: user._id });
    const transactions=await transaction.find().populate('orderId')
    
    return res.render("users/page/wallet", {
        wallet:wlt,
        transactions,
        user,
        username: user.firstname.trim() + " " + user.Lastname.trim(),
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
    const cat = [
        ...new Set(
            find.flatMap((p) =>
                Array.isArray(p.category) ? p.category.map((c) => c.name) : []
            )
        ),
    ];
    const shape = [...new Set(find.map((p) => p.caseShape))];
    const rev = await review.aggregate([
        {
            $group: {
                _id: "$productId",
                averageRating: { $avg: "$rating" },
                totalReviews: { $sum: 1 },
            },
        },
    ]);
    const productWithRatings = find.map((prod) => {
        const ratingData = rev.find(
            (r) => r._id.toString() === prod._id.toString()
        );
        return {
            ...prod.toObject(),
            averageRating: ratingData ? ratingData.averageRating : 0,
            totalReviews: ratingData ? ratingData.totalReviews : 0,
        };
    });
   
    
    const user=await User.findById(req.session.users._id)
    return res.render("users/page/shop", {
       username: user.firstname.trim() + " " + user.Lastname.trim(),
        product: productWithRatings,
        user,
        wish: productsWishlist,
        cartItems: cartfind,
        mat,
        brand,
        cat,
        shape,
        rev,
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
    const reviews = await review.find({
        productId: find._id,
        status: "Accepted",
    });
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
    const user=await User.findById(UserId)
    return res.render("users/page/productDetails", {
       username: user.firstname.trim() + " " + user.Lastname.trim(),
        product: find,
        discount: percent,
        user,
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
        }
        // } else if (prod.inStock > 0 && prod.inStock <= 10) {
        //     console.log(prod.inStock);
            
        //     const s=await Cart.findOneAndUpdate(
        //         { UserId: req.session.users._id, productId: productIds[i] },
        //         { quantity: prod.inStock },
        //         { new: true }
        //     );
        //     console.log(s,"zxcvbnm,.");
            
        // }
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
    const user=await User.findById(req.session.users._id)
    return res.render("users/page/cart", {
        username: user.firstname.trim() + " " + user.Lastname.trim(),
        products: prod,
        subtotal,
        cartItems,
        user,
        total,
        alertMsg,
        user,
    });
});

export const about = asyncHandler(async (req, res) => {
    const user=await User.findById(req.session.users._id)
    return res.render("users/page/about", {
        username: user.firstname.trim() + " " + user.Lastname.trim(),
        user,
    });
});
export const blog = asyncHandler(async (req, res) => {
    const user=await User.findById(req.session.users._id)
    return res.render("users/page/blog", {
       username: user.firstname.trim() + " " + user.Lastname.trim(),
        user,
    });
});
export const blogDetails = asyncHandler(async (req, res) => {
    const user=await User.findById(req.session.users._id)
    return res.render("users/page/blog-details", {
        username: user.firstname.trim() + " " + user.Lastname.trim(),
        user,
    });
});

export const confirmaton = asyncHandler(async (req, res) => {
    const user=await User.findById(req.session.users._id)
    return res.render("users/page/confirmation", {
        username: user.firstname.trim() + " " + user.Lastname.trim(),
        user,
    });
});
export const loadCheckout = asyncHandler(async (req, res) => {
    const find = await User.findOne({ _id: req.session.users._id });
    const address = find.addresses.filter((addr) => addr.status === true);
    const cartfind = await Cart.find({ UserId: req.session.users._id });
    const productIds = cartfind.map((item) => item.productId);
    const wlt = await wallet.findOne({user:find._id})
    const user=await User.findById(req.session.users._id)
    const key = process.env.KEY_ID;
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
        }
    }
    
    return res.render("users/page/checkout", {
        username: user.firstname.trim() + " " + user.Lastname.trim(),
        user,
        address: address,
        product: products,
        prodtotal: prodtotal.toFixed(2),
        ship: ship.toFixed(2),
        tax,
        total: total.toFixed(2),
        cart: cartfind,
        key,
        wallet:wlt.balance,
    });
});
export const contact = asyncHandler(async (req, res) => {
    const user=await User.findById(req.session.users._id)
    return res.render("users/page/contact", {
        username: user.firstname.trim() + " " + user.Lastname.trim(),
        user,
    });
});
export const wishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.session.users._id).populate(
        "wishList"
    );
    const findProd = await product
        .find({ _id: user.wishList })
        .populate("image");

    const prodIds = findProd.map((prod) => prod._id);
    const cartfind = await Cart.find({ productId: { $in: prodIds } });
    return res.render("users/page/whishlist", {
        username: user.firstname.trim() + " " + user.Lastname.trim(),
        user,
        wishlist: findProd,
        cart: cartfind,
    });
});
export const loadAddress = asyncHandler(async (req, res) => {
    const user=await User.findById(req.session.users._id)
    res.render("users/page/address", {
        username: user.firstname.trim() + " " + user.Lastname.trim(),
        user,
        error: null,
    });
});


export const loadcmp = asyncHandler(async (req, res) => {
    const compare = await Compare.find();
    const user=await User.findById(req.session.users._id)
    const productId = compare.map((item) => item.productId);
    const cmp = await product
        .find({ _id: { $in: productId } })
        .populate("brand")
        .populate("image");
    const cart = await Cart.find({ productId: { $in: productId } });
    res.render("users/page/comparison", {
        username: user.firstname.trim() + " " + user.Lastname.trim(),
        user,
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

    if (order) {
        await Order.findByIdAndUpdate(order._id, { show: true }, { new: true });
    }

    const user = await User.findById(req.session.users._id);
    const fullAddress = user.addresses.find(
        (addr) => addr._id.toString() === order.billingAddress.toString()
    );

    res.render("users/page/placeOrder", {
        username: user.firstname.trim() + " " + user.Lastname.trim(),
        user,
        order,
        fullAddress,
    });
});
export const myOrder = asyncHandler(async (req, res) => {
    const user=await User.findById(req.session.users._id)
    const orders = await Order.find({ UserId: req.session.users._id,show:true }).populate(
        {
            path: "items.product",
            populate: [
                { path: "brand", model: "brand" },
                { path: "image", model: "image" },
            ],
        }
    ).sort({ OrderDate: -1 });;

    res.render("users/page/MyOrder", {
        username: user.firstname.trim() + " " + user.Lastname.trim(),
        user,
        orders,
    });
});

export const orderDetails = asyncHandler(async (req, res) => {
    const user=await User.findById(req.session.users._id)
    const order = await Order.findOne({_id:req.params.id,show:true})
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
        username: user.firstname.trim() + " " + user.Lastname.trim(),
        user,
        order,
        Address: billingAddress,
    });
});

export const loadReview = asyncHandler(async (req, res) => {
    const user=await User.findById(req.session.users._id)
    const prod = await product
        .findById(req.params.id)
        .populate("image")
        .populate("brand");
    const rev = await review
        .find({ productId: prod._id, status: "Accepted" })
        .populate("UserId");
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
        username: user.firstname.trim() + " " + user.Lastname.trim(),
        user,
        prod,
        reviews: rev,
        avg,
        data,
    });
});
export const loadWriteRev = asyncHandler(async (req, res) => {
    const user=await User.findById(req.session.users._id)
    const prod = await product.findById(req.params.id).populate("image");
    const order = await Order.findOne({
        UserId: req.session.users._id,
        "items.product": prod._id,
    });
    if(order){
          res.render("users/page/writeReview", {
        username: user.firstname.trim() + " " + user.Lastname.trim(),
        user,
        prod,
        order,
    });
    }
    else{
       res.redirect('/')
    }
  
});
