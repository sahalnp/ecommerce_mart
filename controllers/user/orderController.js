import asyncHandler from "express-async-handler";
import {
    razorpayService,
    verifyPayment,
} from "../../utility/razorpayService.js";
import { Cart } from "../../models/cartModel.js";
import { User } from "../../models/userModel.js";
import orderid from "order-id";
import { Order } from "../../models/orderModel.js";
import { product } from "../../models/productModel.js";
export const intialisePay = asyncHandler(async (req, res) => {
    try {
        const { total } = req.body;
        const payOrder = await razorpayService(total);
        res.json({ order: payOrder });
    } catch (error) {
        res.status(500).json({ error: "Payment initiation failed" });
        console.log(error, "ERROR");
    }
});
export const verifyPay = asyncHandler(async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            paymentMethod,
            addressId,
            couponCode,
            discountAmount,
            walletAmount,
        } = req.body;
        const isVerified = verifyPayment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (isVerified) {
            const find = await Cart.find({
                UserId: req.session.users._id,
            }).populate("productId");
            const user = await User.findById(req.session.users._id);
            if (!find || find.length === 0) {
                return res.status(400).json({ message: "Your cart is empty." });
            }

            const selectedAddress = user.addresses.find(
                (addr) => addr._id.toString() === addressId
            );
            let currentDate = new Date();
            let shippedDate = new Date(currentDate);
            let estimatedDelivery = new Date(currentDate);
            let price = 0;
            find.forEach((item) => {
                price += item.price;
            });

            let tax = 0;
            let ship = 0;

            if (price < 2000) {
                ship = 40;
                tax = (20 / 100) * price;
            } else {
                tax = (12 / 100) * price;
            }
            const total = price + tax + ship - (discountAmount || 0);
            if (total >= 7000) {
                shippedDate.setDate(currentDate.getDate() + 1);
                estimatedDelivery.setDate(currentDate.getDate() + 2);
            } else if (total >= 4000 && total < 7000) {
                shippedDate.setDate(currentDate.getDate() + 3);
                estimatedDelivery.setDate(currentDate.getDate() + 5);
            } else {
                shippedDate.setDate(currentDate.getDate() + 5);
                estimatedDelivery.setDate(currentDate.getDate() + 7);
            }

            const items = find.map((item) => ({
                product: item.productId._id,
                quantity: item.quantity,
                price: item.price,
                status: "Pending",
            }));

            for (let i = 0; i < items.length; i++) {
                const productData = await product.findById(items[i].product);

                if (productData) {
                    const newStock = productData.inStock - items[i].quantity;
                    await product.findByIdAndUpdate(items[i].product, {
                        inStock: newStock < 0 ? 0 : newStock,
                    });
                }
            }
            console.log(isVerified);

            req.session.OrderId = orderid("key").generate();
            await Order.create({
                UserId: req.session.users._id,
                OrderId: req.session.OrderId,
                items,
                billingAddress: addressId,
                paymentMethod,
                paymentStatus: "Pending",
                total,
                subtotal: price,
                discount: discountAmount,
                tax,
                shippingFee: ship,
                amountPaid: 0,
                shippedDate,
                estimatedDelivery,
                couponCode,
                reason:null
            });
        } else {
            console.log("wrong payment ");
        }
        res.json({ success: isVerified });
    } catch (error) {
        res.status(500).json({
            error: "Payment verify failed",
            details: error,
        }); // not `err`

        console.log(error, "ERROR");
    }
});
export const placeOrder = asyncHandler(async (req, res) => {
    const {
        paymentMethod,
        addressId,
        couponCode,
        discountAmount,
        walletAmount,
    } = req.body;
    const find = await Cart.find({ UserId: req.session.users._id }).populate(
        "productId"
    );
    if (!find || find.length === 0) {
        return res.status(400).json({ message: "Your cart is empty." });
    }

    // const selectedAddress = user.addresses.find(
    //     (addr) => addr._id.toString() === addressId
    // );
    let currentDate = new Date();
    let shippedDate = new Date(currentDate);
    let estimatedDelivery = new Date(currentDate);
    let price = 0;
    find.forEach((item) => {
        price += item.price;
    });

    let tax = 0;
    let ship = 0;

    if (price < 2000) {
        ship = 40;
        tax = (20 / 100) * price;
    } else {
        tax = (12 / 100) * price;
    }
    let total = price + tax + ship - (discountAmount || 0);

    if (total >= 7000) {
        shippedDate.setDate(currentDate.getDate() + 1);
        estimatedDelivery.setDate(currentDate.getDate() + 2);
    } else if (total >= 4000 && total < 7000) {
        shippedDate.setDate(currentDate.getDate() + 3);
        estimatedDelivery.setDate(currentDate.getDate() + 5);
    } else {
        shippedDate.setDate(currentDate.getDate() + 5);
        estimatedDelivery.setDate(currentDate.getDate() + 7);
    }

    const items = find.map((item) => ({
        product: item.productId._id,
        quantity: item.quantity,
        price: item.price,
        status: "Pending",
    }));
    req.session.OrderId = orderid("key").generate();
    if (walletAmount) {
        total -= walletAmount;
    }
    for (let i = 0; i < items.length; i++) {
        const productData = await product.findById(items[i].product);

        if (productData) {
            const newStock = productData.inStock - items[i].quantity;
            await product.findByIdAndUpdate(items[i].product, {
                inStock: newStock < 0 ? 0 : newStock,
            });
        }
    }

    await Order.create({
        UserId: req.session.users._id,
        OrderId: req.session.OrderId,
        items,
        billingAddress: addressId,
        paymentMethod,
        paymentStatus: "Pending",
        total,
        subtotal: price,
        discount: discountAmount,
        tax,
        shippingFee: ship,
        amountPaid: 0,
        shippedDate,
        estimatedDelivery,
        couponCode,
        reason:null,
    });
    res.json({ success: true, redirectUrl: "/place/order" });
});
export const orderReturn = asyncHandler(async (req, res) => {
    console.log("sdfghjk");
    
    const { OrderId } = req.body;
    const find = await Order.findOneAndUpdate(
        { OrderId, UserId: req.session.users._id },
        { status: "Return requested",reason },
        { new: true } 
    );

    console.log(find,"zxcvbnm,.");
    
});
export const cancelOrder=asyncHandler(async(req,res)=>{
    try {
    const {OrderId}=req.body
    const find = await Order.findOneAndUpdate(
        { OrderId, UserId: req.session.users._id },
        { status: "Cancelled",reason },
        { new: true } 
    );
    
    console.log(find,"zxcvbnm,.");
    // await User.findByIdAndUpdate(req.session.users._id,{wallet}) 
    } catch (error) {
        console.log(error);
        
    }   
})
export const invoice=asyncHandler(async(req,res)=>{
    res.render('/users/page/invoice',{
        username: req.session.userName,
        user: req.session.users
    })
})