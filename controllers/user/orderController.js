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
import puppeteer from "puppeteer";
import ejs from "ejs";
import path from "path";
import fs from "fs";
import { transaction } from "../../models/transactionModel.js";
import { wallet } from "../../models/walletModel.js";


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

        if (!isVerified) {
            return res.status(400).json({ error: "Payment verification failed" });
        }

        const cartItems = await Cart.find({ UserId: req.session.users._id }).populate("productId");
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "Your cart is empty." });
        }

        const user = await User.findById(req.session.users._id);
        const selectedAddress = user.addresses.find(addr => addr._id.toString() === addressId);
        if (!selectedAddress) {
            return res.status(400).json({ message: "Invalid address selected." });
        }

        let currentDate = new Date();
        let shippedDate = new Date(currentDate);
        let estimatedDelivery = new Date(currentDate);
        let price = 0;
        cartItems.forEach(item => price += item.price);

        let tax = price < 2000 ? (20 / 100) * price : (12 / 100) * price;
        let shippingFee = price < 2000 ? 40 : 0;
        const total = price + tax + shippingFee - (discountAmount || 0);


        if (total >= 7000) {
            shippedDate.setDate(currentDate.getDate() + 1);
            estimatedDelivery.setDate(currentDate.getDate() + 2);
        } else if (total >= 4000) {
            shippedDate.setDate(currentDate.getDate() + 3);
            estimatedDelivery.setDate(currentDate.getDate() + 5);
        } else {
            shippedDate.setDate(currentDate.getDate() + 5);
            estimatedDelivery.setDate(currentDate.getDate() + 7);
        }

        const items = cartItems.map(item => ({
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
        const generatedOrderId = orderid("key").generate();
        req.session.OrderId=generatedOrderId

        const ord=await Order.create({
            UserId: user._id,
            OrderId: generatedOrderId,
            items,
            billingAddress: addressId,
            paymentMethod,
            paymentStatus: "Paid",
            total,
            subtotal: price,
            discount: discountAmount,
            tax,
            shippingFee,
            amountPaid: total,
            shippedDate,
            estimatedDelivery,
            couponCode,
            walletAmount: walletAmount || 0,
            reason: null,
        });

        if (walletAmount > 0) {
            await wallet.findOneAndUpdate(
                { user: req.session.users._id },
                { $inc: { balance: -walletAmount } },
                { new: true }
            );

            await transaction.create({
                UserId: req.session.users._id,
                orderId: ord._id,
                amount: walletAmount,
                type: "Debit",
                paymentMethod: "Wallet",
                description: `Wallet payment for Order #${generatedOrderId}`,
                date: new Date()
            });
        }

        res.json({ success: true });

    } catch (error) {
        console.error("verifyPay error:", error);
        res.status(500).json({
            error: "Payment verification failed",
            details: error.message || error
        });
    }
});

export const placeOrder = asyncHandler(async (req, res) => {
    const UserId=req.session.users._id
    const {
        paymentMethod,
        addressId,
        couponCode,
        discountAmount,
        walletAmount,
    } = req.body;
    const find = await Cart.find({ UserId}).populate(
        "productId"
    );

    const generatedOrderId = orderid("key").generate();
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
    req.session.OrderId =generatedOrderId;
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

    const ord=await Order.create({
        UserId,
        OrderId: generatedOrderId,
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
        walletAmount: walletAmount || 0,
        reason: null,
    });

    if (walletAmount > 0) {
        console.log("sdfghjkl");
        
        await transaction.create({
            UserId,
            orderId: ord._id,
            amount: walletAmount,
            type: "Debit",
            paymentMethod,
            description: `Wallet payment for Order #${generatedOrderId}`,
        });
           await wallet.findOneAndUpdate(
        {
            user: req.session.users._id,
        },
        { $inc: { balance: -walletAmount } },
        {
            new: true,
        }
    );
    }
    res.json({ success: true, redirectUrl: "/place/order" });
});
export const orderReturn = asyncHandler(async (req, res) => {
    try {
        const { OrderId, reason } = req.body;
        const find = await Order.findOneAndUpdate(
            { OrderId, UserId: req.session.users._id },
            { status: "Return", reason },
            { new: true }
        );
        await transaction.findOneAndUpdate(
                { userId: req.session.users._id, orderId: find._id },
                { status: req.body.status },
                { new: true }
            );
        if (!find) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({
            message: "Order return requested ",
            order: find,
        });
    } catch (error) {
        console.error("Cancel error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
export const cancelOrder = asyncHandler(async (req, res) => {
    try {
        const { OrderId, reason } = req.body;
        const UserId=req.session.users_id
        const updatedOrder = await Order.findOneAndUpdate(
            { OrderId, UserId },
            { status: "Cancelled", reason },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            message: "Order cancelled successfully",
            order: updatedOrder,
        });
    } catch (error) {
        console.error("Cancel error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export const invoice = asyncHandler(async (req, res) => {
    const order = await Order.findOne({
        UserId: req.session.users._id,
        OrderId: req.params.id,
    })
        .populate("items.product")
        .populate("billingAddress");
    function generateRandomGSTIN() {
        const stateCodes = [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "23",
            "24",
            "25",
            "26",
            "27",
            "28",
            "29",
            "30",
            "31",
            "32",
            "33",
            "34",
            "35",
            "36",
            "37",
            "38",
            "39",
        ];

        const randomState =
            stateCodes[Math.floor(Math.random() * stateCodes.length)];

        const randomPAN = () => {
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const digits = "0123456789";
            return (
                letters.charAt(Math.floor(Math.random() * 26)) +
                letters.charAt(Math.floor(Math.random() * 26)) +
                letters.charAt(Math.floor(Math.random() * 26)) +
                letters.charAt(Math.floor(Math.random() * 26)) +
                letters.charAt(Math.floor(Math.random() * 26)) +
                digits.charAt(Math.floor(Math.random() * 10)) +
                digits.charAt(Math.floor(Math.random() * 10)) +
                digits.charAt(Math.floor(Math.random() * 10)) +
                digits.charAt(Math.floor(Math.random() * 10)) +
                letters.charAt(Math.floor(Math.random() * 26))
            );
        };

        const entityCode = Math.floor(Math.random() * 9) + 1;
        const checkChar = () => {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return chars.charAt(Math.floor(Math.random() * chars.length));
        };

        return `${randomState}${randomPAN()}${entityCode}Z${checkChar()}`;
    }

    if (!order) {
        return res.status(404).send("Order not found");
    }
    const user = await User.findById(req.session.users._id);
    const add = user.addresses.find(
        (p) => p._id.toString() === order.billingAddress.toString()
    );
    const htmlString = await ejs.renderFile(
        path.join(process.cwd(), "views", "users", "page", "invoice.ejs"),
        {
            username: req.session.userName,
            user: req.session.users,
            order,
            add,
            gst: generateRandomGSTIN(),
        }
    );

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(htmlString, { waitUntil: "networkidle0" });

    const invoicesDir = path.join("public", "invoices");
    if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const pdfPath = path.join(invoicesDir, `invoice-${order.OrderId}.pdf`);
    await page.pdf({ path: pdfPath, format: "A4" });

    await browser.close();
    res.download(pdfPath, `Invoice-${order.OrderId}.pdf`, (err) => {
        if (err) {
            console.error("Download error:", err);
            res.status(500).send("Something went wrong");
        } else {
            fs.unlink(pdfPath, () => {});
        }
    });
});
