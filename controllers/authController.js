import bcrypt from "bcrypt";
import {User} from "../models/user.js";
import  {transporter}  from "../config/sendMail.js";


// Controller for login
export const loginUser = async (req, res) => {
    const emailornumber=req.body.emailornumber;
    const password=req.body.password;
    if(!emailornumber){
        return res.render("login", { user: "Email or number not be empty" });
    }
    if(!password){
        return res.render("login", { user: "Password must be filled" });
    }
    console.log(emailornumber,"kdsfjkfjklj");
        const user = await User.findOne( { $or: [
            { email:emailornumber},
            { number:parseInt(emailornumber)}
            ] });
        
    console.log("user is ",user);
    req.session.user_emailornumber=emailornumber
    
    if (!user) {
        return res.render("login", { user: "User does not exist. Please sign up." });//sending login page if user doesnot exist
    }

    // Compare the entered password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password); // user.password is the stored hashed password
    if (!passwordMatch) {
        return res.render("login", { user: "Incorrect password. Please try again." });//sending login page and sending a message passsword not coorect
    }

    // Proceed with login if the password is correct
    return res.redirect('/')
};

// Controller for signup
export const signupUser = async (req, res) => {

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.session.user = {
        firstname: req.body.firstname,
        Lastname:req.body.lastname,
        email: req.body.email,
        number:req.body.number,
        password: hashedPassword
    };
    console.log(req.session.user,"fjkdsfdsklfjdsklfjdklsfjkslfj"
    );
    
    const existingUser = await User.findOne({ email:req.session.user.email });
    console.log(existingUser);
    //finding if user exist or not
    if (existingUser) {
        return res.render("signup", { user: "User already exists" });
    }
    else{
        const otp = generateotp(); // Generate OTP
        req.session.otp = otp;     
        await sendotp(req.session.user.email, otp); // Send OTP to user's email
        return res.redirect('/otp')
    }
}
const sendotp=async(email,otp)=>{
    try {
        const auth= await transporter.sendMail({
            from:process.env.APP_EMAIL,
            to: email,
            subject:"OTP",
            text:`YOUR OTP TO ENTER THE EDUMART IS: ${otp}`
        })
        console.log("OTP Email sent: " + otp);
        
    } catch (error) {
        console.log("Error sending OTP email:", error)
    }
}
    const generateotp=()=>Math.floor(100000+Math.random()*90000)
export const verifyotp=async (req,res) =>{
    const {otp}=req.body
   try {
    if(otp==req.session.otp){
        const newUser = await User.create(req.session.user);
        console.log("The new user",newUser);
        res.redirect('/phoneotp')
    }
    else{
        res.render('otp',{title: "OTP",error:"Invalid OTP:Please Try again"})
    }
   } catch (error) {
    console.log("The Error",error);
    
   } 
}
   export const logout = (req, res) => {
    if (req.session.user_emailornumber) {
        req.session.destroy((err) => {
            if (err) {
                console.log("Error destroying session:", err);
                return res.status(500).send("Logout failed");
            }
            res.clearCookie("auth");
            res.redirect("/");
            console.log("logouted");
            
        });
    } else {
        res.redirect("/");
    }
};
