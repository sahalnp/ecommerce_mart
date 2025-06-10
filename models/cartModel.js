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
    price:{
        type:Number,
        required:true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    status:{
        type:Boolean,
        default:true
    }
});
export const Cart = mongoose.model("Cart", cartSchema);
