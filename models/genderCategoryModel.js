import mongoose from "mongoose";
const genderSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }

})
export const genderModel=mongoose.model('gender',genderSchema)