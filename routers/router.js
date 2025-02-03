  import express from "express";
  import User from "../models/user.js";
  import { loginUser, signupUser,otp } from "../controllers/authController.js";

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


  export default router;
