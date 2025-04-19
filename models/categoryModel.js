    import mongoose from "mongoose";

    const categorySchema=new mongoose.Schema({
        name: {
            type:String,
            required: true,  
        }   ,
        isListed: {
            type: Boolean,
            default: true,
        },
        isDlt:{
            type:Boolean,
            default:false
        }
    })
    export const categoryModel=mongoose.model('category',categorySchema)

