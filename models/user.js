import mongoose from "mongoose";
import dotenv from "dotenv";
   
dotenv.config();

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    Lastname:{ type: String, required: true },
    password: { type: String, required: true },
    email: { type:String,required: true, unique : true  },
    role: { type: Number, default: 0 },
    number:{type:String,required:true},
    createdAt: { type: Date, default: Date.now },
});
export const User = mongoose.model("User", userSchema);




