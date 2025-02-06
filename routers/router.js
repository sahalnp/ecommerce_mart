  import express from "express";
  import { loginUser, signupUser, verifyotp } from "../controllers/authController.js";

  const router = express.Router();

  router.get("/", (req, res) => {
    res.render("index");
  });

  router.get("/login", (req, res) => { 
    res.render("login", { title: "Login-Edumart", user: null });
  });

  router.post("/login",loginUser)
  
  router.get("/signup", (req, res) => {
    res.render('signup.ejs',{title:"Signup-Edumart",user:null})
  });
  router.post("/signup",signupUser)

  router.get('/otp',(req,res)=>{
    res.render('otp',{title:"OTP",error:null})
  })
  
  router.post('/otp',verifyotp)

  export default router;
