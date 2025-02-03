import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(" Database connected successfully");
    } catch (error) {
        console.error(" Database connection error:", error);
        process.exit(1);
    }
};

export {connectDB}; 
