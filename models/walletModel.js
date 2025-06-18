import mongoose from "mongoose";
const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'transaction',
        },
    ],
});
export const wallet=mongoose.model('wallet',walletSchema)