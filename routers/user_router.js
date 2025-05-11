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
import { isUserloggedIn } from "../middleware/authMiddleware.js";
import {
    account,
    loadsignup,
    otp,
    phoneotp,
    auth_google,
    auth_google_callback,
    reset_pass_otp,
    pass_reset,
} from "../controllers/user/authViewController.js";
import { sendsms } from "../utility/sendphoneotp.js";
import {
    about,
    blog,
    blogDetails,
    checkout,
    confirmaton,
    contact,
    home,
    laodProduct,
    laodShop,
    loadcart,
    loadEditProfile,
    wishlist,
} from "../controllers/user/userPageLoader.js";
import { addtoCart,  addTowhish, editProfile, removeFromWish } from "../controllers/user/userDashboard.js";

export const UserRouter = express.Router();

UserRouter.get("/", home);

UserRouter.get("/login", isUserloggedIn);
UserRouter.post("/login", loginUser);

UserRouter.get("/signup", loadsignup);
UserRouter.post("/signup", signupUser);

UserRouter.get("/otp", send_otp, otp);
UserRouter.post("/otp", verifyotp);

UserRouter.get("/phoneotp", sendsms, phoneotp);
UserRouter.post("/phoneotp", phoneverifyotp);

UserRouter.get("/account", account);

UserRouter.get("/logout", logout);

UserRouter.get("/reset", reset_pass_otp);
UserRouter.post("/reset", email_check);

UserRouter.post("/reset_verify_otp", reset_verify_otp);

UserRouter.get("/forgotPassword", pass_reset);
UserRouter.post("/forgotPassword", new_pass);

UserRouter.get("/auth/google", auth_google);
UserRouter.get("/auth/google/callback", auth_google_callback);

UserRouter.get("/profile/edit/:id", loadEditProfile);
UserRouter.post("/profile/edit/:id", editProfile);

UserRouter.get("/shop", laodShop);
UserRouter.get("/product/:id", laodProduct);
UserRouter.post("/product/:id",addtoCart)

UserRouter.get("/cart", loadcart);

UserRouter.get("/about", about);

UserRouter.get("/blog", blog);

UserRouter.get("/blog-details", blogDetails);

UserRouter.get('/wishlist',wishlist)
UserRouter.post('/wishlist/add/:id',addTowhish)
UserRouter.post('/wishlist/remove/:id',removeFromWish)

UserRouter.get("/confirmation", confirmaton);

UserRouter.get("/checkout", checkout);

UserRouter.get("/contact", contact);
export default UserRouter;
