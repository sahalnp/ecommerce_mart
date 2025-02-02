import bcrypt from "bcrypt";
import User from "../models/user.js";

// Controller for login
export const loginUser = async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findOne({ name });
    if (!user) {
        return res.render("login", { user: "User does not exist. Please sign up." });
    }

    // Add further password validation here (e.g. comparing hashed passwords)

    return res.render("index");
};

// Controller for signup
export const signupUser = async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ name });
    if (existingUser) {
        return res.render("signup", { user: "User already exists" });
    }

    else{
        res.render("otp", { title: "OTP" });
        const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    }
    res.render("otp", { title: "OTP" });
};
