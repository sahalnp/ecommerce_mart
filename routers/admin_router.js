import {
    load_adminSignup,
    adminDashboard,
    admin_Otp,
    loadPasskey,
    loadUser_Edit,
    adminLogout,
    userDetails,
    add_product,
    categoryLoad,
    addCategoryLoad,
} from "../controllers/admin/adminPageLoader.js";
import {
    adminSignup,
    verify_adminOtp,
    passkeySend,
    admin_login,
} from "../controllers/admin/adminAuthController.js";
import express from "express";
import {
    userEdit,
    userDelete,
    adminEdit,
    
} from "../controllers/admin/adminDashboardController.js";

import {  productAdd } from "../controllers/admin/productController.js";
import { isAdminloggedIn } from "../middleware/adminAuthMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import {addCategory} from "../controllers/admin/categoryManageController.js"

const adminRouter = express.Router();

adminRouter.get("/admin/login",isAdminloggedIn,loadPasskey);
adminRouter.post("/admin/login", admin_login);

adminRouter.post("/admin/login/passkey", passkeySend);

adminRouter.get("/admin/signup", load_adminSignup);
adminRouter.post("/admin/signup", adminSignup);

adminRouter.get("/admin/otp", admin_Otp);
adminRouter.post("/admin/otp", verify_adminOtp);

adminRouter.get("/admin/logout", adminLogout);
adminRouter.get("/admin/dashboard", adminDashboard);

adminRouter.get("/admin/edit-user/:id", loadUser_Edit);
adminRouter.post("/admin/edit-user/:id", userEdit);

adminRouter.post("/admin/delete-user/:id", userDelete);
adminRouter.post("/admin/profile/:id", adminEdit);

adminRouter.get("/admin/add_product", add_product);

adminRouter.get('/admin/category',categoryLoad)

adminRouter.post('/admin/upload', upload.single('image'),productAdd)
adminRouter.get('/admin/userDetails',userDetails)

adminRouter.get('/admin/addCategory',addCategoryLoad)
adminRouter.post('/admin/addCategory',addCategory)

export default adminRouter;
