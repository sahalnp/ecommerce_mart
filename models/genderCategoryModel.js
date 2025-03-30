import mongoose from "mongoose";
const genderSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Unisex"] 
    }

})
export const genderModel=mongoose.model('gender',genderSchema)