import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema({
    UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null  
  },
  type: {
    type: String,
    enum: ['Credit', 'Debit'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },

  status: {
    type: String,
     enum: [
            "Pending",
            "Shipped",
            "Delivered",
            "Cancelled",
            "Return",
        ],
    default: 'Pending'
  },
   
},{
    timestamps:true
});

export const transaction = mongoose.model('transaction', transactionSchema);