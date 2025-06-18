import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  Lastname: { type: String, required: true },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (v) {
        return /^(?=.*[0-9])(?=.*[!@#$%^&*])/.test(v);
      },
    },
  },
  email: { type: String, required: true, unique: true },
  dob:{
    type:String
  },
  gender:{
    type:String
  },
  role: { type: Number, default: 0 },
  number: { type: String, required: true },
  addresses: [
    {
      name: { type: String, default: null },
      number: { type: String, default: null },
      street: { type: String, default: null },
      localPlace: { type: String, default: null },
      landmark: { type: String, default: null },
      city: { type: String, default: null },
      district: { type: String, default: null },
      state: { type: String, default: null },
      pincode: { type: Number, default: null },
      country: { type: String, default: null },
      addressType: { type: String, default: "Home" },
      status: { type:Boolean,default:true },
    },
  ],
  rating:{
    type:Number,
    default:0
  },
  wishList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  status: {
    type: Boolean,
    default: true,
  },
  isDlt: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);
