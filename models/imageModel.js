import mongoose from "mongoose";

const imageSchema=new mongoose.Schema({
    filename:{
        type:String,
        required:true
    },
    filepath:{
        type:String,
        required:true
    },
    uploadedAt:{
        type:Date,
        default:Date.now()
    }
})
export const imageModel=mongoose.model('image',imageSchema)
