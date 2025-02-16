import express from "express";
import { loginUser, signupUser, verifyotp,logout, phoneverifyotp } from "../controllers/authController.js";
import {isUserloggedIn,ensureAuthenticated} from "../middleware/userauth.js";
import {account, loadLogin,loadsignup,otp,home, phoneotp,auth_google,auth_google_callback} from "../controllers/loadingpage.js"
import { sendsms } from "../utlity/sendphoneotp.js";

export const router = express.Router();

router.get("/",home)

router.get("/login",isUserloggedIn,loadLogin)
router.post("/login",loginUser)

router.get("/signup",loadsignup)
router.post("/signup",signupUser)

router.get('/otp',otp)
router.post('/otp',verifyotp)

router.get("/phoneotp",sendsms,phoneotp)
router.post('/phoneotp',phoneverifyotp)

router.get('/account',account)

router.get('/logout',logout)

router.get("/auth/google",ensureAuthenticated,auth_google);
router.get("/auth/google/callback", auth_google_callback);
  
export default router;
