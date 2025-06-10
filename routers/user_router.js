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
import {
    isUserloggedIn,
    isUserLoggedOut,
} from "../middleware/userAuthMiddleware.js";
import {
    account,
    loadsignup,
    otp,
    phoneotp,
    auth_google,
    auth_google_callback,
    reset_pass_otp,
    pass_reset,
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
    dltAddress,
    home,
    loadProduct,
    laodShop,
    loadAddress,
    loadcart,
    loadCheckout,
    loadProfile,
    wishlist,
    loadcmp,
    loadtryOn,
    loadOrderPlace,
    myOrder,
    orderDetails,
    loadReview,
    loadWriteRev,
} from "../controllers/user/userPageLoader.js";
import {
    addAddress,
    addCompare,
    addtoCart,
    addTowhish,
    buy,
    cartDlt,
    checkout,
    cmpReset,
    cmpResetOne,
    editProfile,
    quantchnge,
    rating,
    removeFromWish,
    reviewRighted,
} from "../controllers/user/userDashboard.js";
import { intialisePay, placeOrder, verifyPay } from "../controllers/user/orderController.js";

export const UserRouter = express.Router();

UserRouter.get("/", isUserloggedIn, home);

UserRouter.get("/login", isUserLoggedOut, loadLogin);
UserRouter.post("/login", loginUser);

UserRouter.get("/signup", isUserLoggedOut, loadsignup);
UserRouter.post("/signup", signupUser);

UserRouter.get("/otp", isUserLoggedOut, send_otp, otp);
UserRouter.post("/otp", verifyotp);

UserRouter.get("/phoneotp", isUserLoggedOut, sendsms, phoneotp);
UserRouter.post("/phoneotp", phoneverifyotp);

UserRouter.get("/account", isUserLoggedOut, account);

UserRouter.get("/logout", logout);
UserRouter.get("/resetpassEmail", isUserLoggedOut, loadresetpassEmail);
UserRouter.post("/resetpassEmail", resetPassEmail);

UserRouter.get("/reset", isUserLoggedOut, reset_pass_otp);
UserRouter.post("/reset", email_check);

UserRouter.post("/reset_verify_otp", reset_verify_otp);

UserRouter.get("/forgotPassword", isUserLoggedOut, pass_reset);
UserRouter.post("/forgotPassword", new_pass);

UserRouter.get("/auth/google", isUserLoggedOut, auth_google);
UserRouter.get("/auth/google/callback", auth_google_callback);

UserRouter.get("/profile/edit/:id", isUserloggedIn, loadProfile);
UserRouter.post("/profile/edit/:id", editProfile);

UserRouter.get("/shop", isUserloggedIn, laodShop);
UserRouter.get("/product/:id", isUserloggedIn, loadProduct);
UserRouter.post("/product/:id", addtoCart);
UserRouter.post('/rating',rating)

UserRouter.get("/cart", isUserloggedIn, loadcart);
UserRouter.post('/add-to-cart',addtoCart)
UserRouter.post("/cart/quantity", quantchnge);
UserRouter.post('/cart/delete',cartDlt)

UserRouter.get("/about", isUserloggedIn, about);

UserRouter.get("/blog", isUserloggedIn, blog);

UserRouter.get("/blog-details", isUserloggedIn, blogDetails);

UserRouter.get("/wishlist", isUserloggedIn, wishlist);
UserRouter.post("/wishlist/add/:id", isUserloggedIn, addTowhish);
UserRouter.post("/wishlist/remove/:id", isUserloggedIn, removeFromWish);

UserRouter.get("/confirmation", isUserloggedIn, confirmaton);

UserRouter.get("/checkout", isUserloggedIn, loadCheckout);
UserRouter.post("/checkout", checkout);

UserRouter.get("/contact", isUserloggedIn, contact);

UserRouter.get("/add-address", isUserloggedIn, loadAddress);
UserRouter.post("/add-address", addAddress);

UserRouter.get("/address/delete/:id",isUserloggedIn, dltAddress);

UserRouter.get('/compare',isUserloggedIn,loadcmp)
UserRouter.post('/buy',buy)
UserRouter.post('/addCompare',addCompare)
UserRouter.post('/cmp/resetAll',cmpReset)
UserRouter.post('/cmp/resetOne',cmpResetOne)

UserRouter.get('/tryOn/:id',isUserloggedIn,loadtryOn)

UserRouter.post('/razorpay/create-order',intialisePay)
UserRouter.post('/razorpay/verify-payment',verifyPay)
UserRouter.get('/place/order',loadOrderPlace)
UserRouter.post('/order/place',placeOrder)

UserRouter.get('/MyOrder',isUserloggedIn,myOrder)
UserRouter.get('/MyOrder/:id',isUserloggedIn,orderDetails)
UserRouter.get('/order/review/:id',isUserloggedIn,loadReview)

UserRouter.get('/writedReview/:id',loadWriteRev)
UserRouter.post('/writedReview/:id',reviewRighted)


export default UserRouter;