import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    discount: {
      type: Number, 
      required: true,
      min: 1,
      max: 100
    },
    minAmount: {
      type: Number, 
      required: true,
      min: 0
    },
    maxDiscount: {
      type: Number,
      required: true,
      min: 0
    },
    active: {
      type: Boolean,
      default: true
    },
    usageLimit: {
      type: Number,
      default: 1 
    },
usedBy: [
      {
        userId: {
           type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        usageCount: {
          type: Number,
        }
      }
    ],
    isDlt: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
