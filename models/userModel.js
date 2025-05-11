import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    Lastname: { type: String, required: true },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator: function (v) {
                return /^(?=.*[0-9])(?=.*[!@#$%^&*])/.test(v);
            },
        },
    },
    email: { type: String, required: true, unique: true },
    role: { type: Number, default: 0 },
    number: { type: String, required: true },
    country: { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    pincode: { type: Number, default: null },
    wishList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    }],
    createdAt: { type: Date, default: Date.now },
});
export const User = mongoose.model("User", userSchema);
