import express from "express";
import { loginUser, signupUser, verifyotp,logout } from "../controllers/authController.js";
import {isUserloggedIn} from "../middleware/userauth.js";
import {account, loadLogin,loadsignup,otp,home, phoneotp} from "../controllers/loadingpage.js"
import { sendsms } from "../utlity/sendsms.js";

export const router = express.Router();

router.get("/",home)

router.get("/login",isUserloggedIn,loadLogin)
router.post("/login",loginUser)

router.get("/signup",loadsignup)
router.post("/signup",signupUser)

router.get('/otp',otp)
router.post('/otp',verifyotp)

router.get("/phoneotp",phoneotp)

router.get('/account',account)

router.get('/logout',logout)
  
export default router;
