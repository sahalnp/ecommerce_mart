import mongoose from "mongoose";
import dotenv from "dotenv";
   
dotenv.config();

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique : true  },
    role: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});
export const User = mongoose.model("User", userSchema);




