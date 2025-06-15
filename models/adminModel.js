import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    Firstname: { type: String, required: true },
    Lastname: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: Number, default: 2 },
    number: { type: String, required: true },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    isDlt: {
        type: Boolean,
        default: false,
    },
});
export const admin = mongoose.model("admin", adminSchema);
