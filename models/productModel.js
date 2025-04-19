import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        productPrice: {
            type: Number,
            required: true,
        },
        salePrice: {
            type: Number,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:'imageModel',
                required:true
            },
        ],
        size: {
            type: Array,
            required: true,
        },
        category:[{
            type: mongoose.Schema.Types.ObjectId,
            ref:'category',
            required: true,
        }
    ]
        ,
        genderCategory:{
            type:Array,
            required:true
        },
        inStock:{
            type:Number,
            required:true,  
            min:0,
            max:15
        },
        isListed: {
            type: Boolean,
            default: true,
        },
        isListed:{
            type:Boolean,
            default:false
        }
    },
    { timestamps: true }
);

export const product = mongoose.model("product", productSchema);
