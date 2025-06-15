import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

         brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "brand",
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        pricing: {
            price: {
                type: Number,
                required: true,
            },
            salePrice: {
                type: Number,
                required: true,
            },
        },

        bandColour: {
            type: String,
            required: true,
        },

        bandMaterial: {
            type: String,
            required: true,
        },

        warranty: {
            type: String,
            required: true,
        },

        movementType: {
            type: String,
            required: true,
        },

        itemWeight: {
            type:String,
            required: true,
        },

        modelNumber: {
            type: String,
            required: true,
        },

        caseShape: {
            type: String,
            required: true,
        },

        specialFeatures: {
            type: Array,
            required: true,
        },


        caseDiameter: {
            type: String,
            required: true,
        },

            image: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "image",
                    required: true,
                },
            ],
        vrImage:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"image",
            required:true
        },

        category: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "category",
                required: true,
            },
        ],
        inStock: {
            type: Number,
            required: true,
            min: 0,
        },
        
        isFeatured:{
            type:Boolean,
            default:false
        },

        isListed: {
            type: Boolean,
            default: true,
        },
        isCart:{
            type:Boolean,
            default:false
        }
    },
    { timestamps: true }
);


export const product = mongoose.model("product", productSchema);
