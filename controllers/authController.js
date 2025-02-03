import bcrypt from "bcrypt";
import User from "../models/user.js";
import { Auth } from "two-step-auth";

// Controller for login
export const loginUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Find the user by name (or email if needed)
    const user = await User.findOne({ name: name });
    if (!user) {
        return res.render("login", { user: "User does not exist. Please sign up." });
    }

    // Compare the entered password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password); // user.password is the stored hashed password
    if (!passwordMatch) {
        return res.render("login", { user: "Incorrect password. Please try again." });
    }

    // Proceed with login if the password is correct
    return res.render("index");
};

// Controller for signup
export const signupUser = async (req, res) => {
    const { name, email, password } = req.body;
    req.session.email=req.body.email
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ name });
    if (existingUser) {
        return res.render("signup", { user: "User already exists" });
    }

    else{
        try {
            const result = await Auth(req.session.email, "Edumart");
            console.log(result);
            if (result.success) {
                const { OTP, mail } = result;
                console.log("otp",OTP,mail)
                res.render('otp',{title:"OTP"})
            } else {
                res.status(400).json({ message: 'Failed to generate OTP' });
            }
        } catch (error) {
            console.log("Error in OTP generation:", error);
            res.status(500).json({ message: 'Server error, unable to generate OTP' });
        }
         
    }
};
//Controller for otp 
export const otp = async (req, res) => {
    console.log("sahal");
    
    try {
        const result = await Auth(req.session.email, "Edumart");
        console.log(result);
        if (result.success) {
            const { OTP, mail } = result; 
            res.status(200).json({ message: 'OTP sent successfully', OTP, mail });
        } else {
            res.status(400).json({ message: 'Failed to generate OTP' });
        }
    } catch (error) {
        console.log("Error in OTP generation:", error);
        res.status(500).json({ message: 'Server error, unable to generate OTP' });
    }
};