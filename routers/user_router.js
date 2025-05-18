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
    resetPassEmail,
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
    resetpass,
    loadresetpassEmail,
    loadLogin,
} from "../controllers/user/authViewController.js";
import { sendsms } from "../utility/sendphoneotp.js";
import {
    about,
    blog,
    blogDetails,
    confirmaton,
    contact,
    home,
    laodProduct,
    laodShop,
    loadAddress,
    loadcart,
    loadCheckout,
    loadProfile,
    wishlist,
} from "../controllers/user/userPageLoader.js";
import { addtoCart,  addTowhish, checkout, editProfile, quantchnge, removeFromWish } from "../controllers/user/userDashboard.js";


export const UserRouter = express.Router();

UserRouter.get("/", isUserloggedIn,home);

UserRouter.get("/login", loadLogin);
UserRouter.post("/login", loginUser);

UserRouter.get("/signup", loadsignup);
UserRouter.post("/signup", signupUser);

UserRouter.get("/otp", send_otp, otp);
UserRouter.post("/otp", verifyotp);

UserRouter.get("/phoneotp", sendsms, phoneotp);
UserRouter.post("/phoneotp", phoneverifyotp);

UserRouter.get("/account",isUserloggedIn, account);

UserRouter.get("/logout", logout);
UserRouter.get('/resetpassEmail',loadresetpassEmail)
UserRouter.post('/resetpassEmail',resetPassEmail)

UserRouter.get("/reset", reset_pass_otp);
UserRouter.post("/reset", email_check);

UserRouter.post("/reset_verify_otp", reset_verify_otp);

UserRouter.get("/forgotPassword", pass_reset);
UserRouter.post("/forgotPassword", new_pass);

UserRouter.get("/auth/google", auth_google);
UserRouter.get("/auth/google/callback", auth_google_callback);

UserRouter.get("/profile/edit/:id",isUserloggedIn,loadProfile);
UserRouter.post("/profile/edit/:id", editProfile);

UserRouter.get("/shop", isUserloggedIn,laodShop);
UserRouter.get("/product/:id", isUserloggedIn,laodProduct);
UserRouter.post("/product/:id",isUserloggedIn,addtoCart)

UserRouter.get("/cart", isUserloggedIn,loadcart);
UserRouter.post('/cart/quantity', isUserloggedIn, quantchnge);


UserRouter.get("/about", isUserloggedIn, about);

UserRouter.get("/blog", isUserloggedIn,blog);

UserRouter.get("/blog-details",isUserloggedIn, blogDetails);

UserRouter.get('/wishlist',isUserloggedIn,wishlist)
UserRouter.post('/wishlist/add/:id',isUserloggedIn,addTowhish)
UserRouter.post('/wishlist/remove/:id',isUserloggedIn,removeFromWish)

UserRouter.get("/confirmation",isUserloggedIn, confirmaton);

UserRouter.get("/checkout",isUserloggedIn, loadCheckout);
UserRouter.post('/checkout',checkout)

UserRouter.get("/contact",isUserloggedIn, contact);

UserRouter.get("/address",isUserloggedIn,loadAddress)

export default UserRouter;
