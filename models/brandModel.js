import mongoose from "mongoose";
const brandSchema=new mongoose.Schema({
    name: {
        type:String,
        required: true,  
    }   ,
    isListed: {
        type: Boolean,
        default: true,
    },
})
export const brandModel=mongoose.model('brand',brandSchema)