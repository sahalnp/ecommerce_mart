import {
    load_adminSignup,
    adminDashboard,
    admin_Otp,
    loadPasskey
} from "../controllers/admin/adminPageLoader.js";
import {
    adminSignup,
    verify_adminOtp,
    passkeySend,
    adminLogout,
    admin_login,
} from "../controllers/admin/adminAuthController.js";
import express from "express";
const adminRouter = express.Router();

adminRouter.get("/admin/login",loadPasskey );
adminRouter.post("/admin/login",admin_login);

adminRouter.post("/admin/login/passkey", passkeySend);

adminRouter.get("/admin/signup", load_adminSignup);
adminRouter.post("/admin/signup", adminSignup);

adminRouter.get("/admin/otp", admin_Otp);
adminRouter.post("/admin/otp",verify_adminOtp);

adminRouter.get('/admin/logout',adminLogout)

adminRouter.get("/admin/dashboard", adminDashboard);

export default adminRouter;
