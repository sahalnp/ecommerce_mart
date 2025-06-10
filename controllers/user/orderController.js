import asyncHandler from "express-async-handler";
import { razorpayService, verifyPayment } from "../../utility/razorpayService.js";
export const intialisePay=asyncHandler(async(req,res)=>{
    try {
        const {total,razorpay_payment_id}=req.body
        console.log(total,razorpay_payment_id,"asdfghjkloiuytrewq");
        
        const payOrder=await razorpayService(total,razorpay_payment_id)
        res.json({ order: payOrder }); 

        console.log(payOrder,"dchjklhgfcgh;od"); 
    } catch (error) {
        res.status(500).json({ error: "Payment initiation failed" });
        console.log(error,"ERROR");       
    }
})
export const verifyPay=asyncHandler(async(req,res)=>{
    try {
       const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const isVerified = verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        res.json({ success: isVerified }); 
    } catch (error) {
       res.status(500).json({ error: "Payment verify failed", details: error }); // not `err`

        console.log(error,"ERROR");
    }
})
export const placeOrder = asyncHandler(async (req, res) => {
    const { paymentMethod, addressId, couponCode, discountAmount } = req.body;
    const find = await Cart.find({ UserId: req.session.users._id }).populate(
        "productId"
    ); 
// find.forEach(async (d) => {
    
//     const s = await product.updateOne(
//         { _id: d.productId._id },
//         { $inc: { inStock: -d.quantity } }
//     );
// });

 
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
        couponCode
    });
    res.json({ success: true, redirectUrl: "/place/order" });
});
