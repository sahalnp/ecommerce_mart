import asyncHandler from "express-async-handler";
import { User } from "../../models/userModel.js";

export const editProfile=asyncHandler(async(req,res)=>{
    const {firstname,Lastname,email,number}=req.body
    await User.findByIdAndUpdate(req.params.id,{firstname,Lastname,email,number})
    return res.redirect('/')
})