import mongoose from "mongoose";
import { product } from "./productModel.js";

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'image',
    required:true
  },
  description: {
    type: String
  },
  productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  link:{
    type:String,
  },
  isDlt:{
    type:Boolean,
    default:false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const banner = mongoose.model("banner", bannerSchema);
