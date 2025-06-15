import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
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
    rating:{
        type:Number,
        required:true
    },
    title: String,
    description: String,
    status:{
        type:String,
          enum: [
            "Pending",
            "Rejected",
            "Accepted"
        ],
    },
    date: Date,
});
export const review = mongoose.model("review", reviewSchema);
