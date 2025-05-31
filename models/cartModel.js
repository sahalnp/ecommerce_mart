import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
    },
    productName:{
        type:String,
        required:true
    },
    quantity: {
        type: Number,
        required: true,
    },
});
export const Cart = mongoose.model("Cart", cartSchema);
