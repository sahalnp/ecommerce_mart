import {
    load_adminSignup,
    adminDashboard,
    admin_Otp,
    loadPasskey,
    loadUser_Edit,
    adminLogout,
    userDetails,
    editAdmin,
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
    profileEdit,
    userStatus,
} from "../controllers/admin/adminDashboardController.js";

import {
    editProduct,
    getAllProducts,
    imageDlt,
    loadAdd_product,
    productAdd,
    productEdit,
    productListing,
} from "../controllers/admin/productController.js";
import { isAdminloggedIn, isAdminLoggedOut } from "../middleware/adminAuthMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import {
    addCategory,
    addCategoryLoad,
    categorydlt,
    categoryEdit,
    categoryLoad,
    Editcatgory,
} from "../controllers/admin/categoryManageController.js";
import {
    addBrand,
    brandList,
    editBrand,
    loadBrandAdd,
    loadEditBrand,
    updateStatus,
} from "../controllers/admin/adminBrandController.js";
import csurf from "csurf";

const csrfProtection = csurf({ cookie: true });


const adminRouter = express.Router();

adminRouter.get("/admin/login", isAdminLoggedOut, loadPasskey);
adminRouter.post("/admin/login", admin_login);

adminRouter.post("/admin/login/passkey", passkeySend);

adminRouter.get("/admin/signup",isAdminLoggedOut, load_adminSignup);
adminRouter.post("/admin/signup", adminSignup);

adminRouter.get("/admin/otp", isAdminLoggedOut,admin_Otp);
adminRouter.post("/admin/otp", verify_adminOtp);

adminRouter.get("/admin/logout", adminLogout);
adminRouter.get("/admin/dashboard", isAdminloggedIn, adminDashboard);

adminRouter.get("/admin/edit-user/:id", isAdminloggedIn,loadUser_Edit);
adminRouter.post("/admin/edit-user/:id", userEdit);

adminRouter.post("/admin/delete-user/:id",  isAdminloggedIn,userDelete);
adminRouter.post("/admin/profile/:id", adminEdit);

adminRouter.get("/admin/add_product", isAdminloggedIn, loadAdd_product);

adminRouter.get("/admin/category",  isAdminloggedIn,categoryLoad);

adminRouter.post("/admin/upload", upload.array("photos", 15), productAdd);
adminRouter.get("/admin/userDetails", userDetails);

adminRouter.get("/admin/addCategory", isAdminloggedIn, addCategoryLoad);
adminRouter.post("/admin/addCategory", addCategory);

adminRouter.get("/admin/editCategory/:id",  isAdminloggedIn,categoryEdit);
adminRouter.post("/admin/editCategory/:id", Editcatgory);

adminRouter.get("/admin/category/delete/:id",  isAdminloggedIn,categorydlt);

adminRouter.get("/admin/edit/:id" ,isAdminloggedIn,editAdmin)
adminRouter.post('/admin/edit/:id',profileEdit)

adminRouter.get("/admin/products",  isAdminloggedIn,getAllProducts);

adminRouter.get("/admin/product/edit/:id", isAdminloggedIn, editProduct);
adminRouter.post("/admin/product/edit/:id", upload.array("photos"), productEdit);

adminRouter.post('/admin/product/:productId/delete-image',imageDlt)
adminRouter.post('/admin/product/listing/:id',productListing)

adminRouter.get("/admin/brand", isAdminloggedIn, brandList);

adminRouter.get("/admin/brand/edit/:id",  isAdminloggedIn,loadEditBrand);
adminRouter.post("/admin/brand/edit/:id", editBrand);

adminRouter.get("/admin/brand/add",  isAdminloggedIn,loadBrandAdd);
adminRouter.post("/admin/brand/add", addBrand);

adminRouter.post("/admin/brand/update-status/:id", updateStatus);
adminRouter.post('/admin/user/update-status/:id',userStatus)

export default adminRouter;
