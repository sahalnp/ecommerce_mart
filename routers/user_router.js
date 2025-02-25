import express from "express";
import {
    loginUser,
    signupUser,
    verifyotp,
    logout,
    phoneverifyotp,
    email_check,
    reset_verify_otp,
    new_pass,
    send_otp,
} from "../controllers/user/userAuthController.js";
import { isUserloggedIn } from "../middleware/userauth.js";
import {
    account,
    loadsignup,
    otp,
    home,
    phoneotp,
    auth_google,
    auth_google_callback,
    reset_pass_otp,
    pass_reset,
} from "../controllers/user/authViewController.js";
import { sendsms } from "../utility/sendphoneotp.js";

export const router = express.Router();

router.get("/", home);

router.get("/login",isUserloggedIn);
router.post("/login", loginUser);

router.get("/signup", loadsignup);
router.post("/signup", signupUser);

router.get("/otp",send_otp, otp);
router.post("/otp", verifyotp);

router.get("/phoneotp", sendsms, phoneotp);
router.post("/phoneotp", phoneverifyotp);

router.get("/account", account);

router.get("/logout", logout);

router.get("/reset", reset_pass_otp);
router.post("/reset", email_check);

router.post("/reset_verify_otp", reset_verify_otp);

router.get("/pass_reset", pass_reset);
router.post("/pass_reset", new_pass);

router.get("/auth/google", auth_google);

router.get("/auth/google/callback", auth_google_callback);

export default router;
