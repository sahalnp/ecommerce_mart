import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
            quantity: Number,
            price: {
                type: Number,
                required: true,
            },
            returnDate: Date,
        },
    ],
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    OrderId: {
        type: String,
    },
    OrderDate: {
        type: Date,
        default: Date.now,
    },

    estimatedDelivery: {
        type: Date,
        default: function () {
            const deliveryDate = new Date(this.OrderDate);
            deliveryDate.setDate(deliveryDate.getDate() + 5);
            return deliveryDate;
        },
    },
    couponCode: {
        type: String,
    },

    shippedDate: Date,
    deliveredDate: Date,

    billingAddress: {
        type: mongoose.Schema.Types.ObjectId,
    },

    paymentMethod: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: String,
        default: "Pending",
        enum: [
            "Pending",
            "Refunded",
            "Completed"
        ],
    },

    amountPaid: {
        type: Number,
        default: 0,
    },
    walletAmount:{
        type:Number
    },
    shippingFee: Number,
    discount: Number,
    tax: Number,
    subtotal: Number,
    total: Number,
    reason:{
        type:String
    },
    status: {
        type: String,
        enum: [
            "Pending",
            "Shipped",
            "Delivered",
            "Cancelled",
            "Return",
        ],
        default: "Pending",
    },
});

export const Order = mongoose.model("Order", orderSchema);
