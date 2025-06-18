import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema({
      userId: {
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
    enum: ['credit', 'debit'],
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
  date: {
    type: Date,
    default: Date.now
  }
   
},{
    timestamps:true
});

export const transaction = mongoose.model('transaction', transactionSchema);