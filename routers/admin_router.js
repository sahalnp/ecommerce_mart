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
import { isAdminloggedIn } from "../middleware/authMiddleware.js";
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

const adminRouter = express.Router();

adminRouter.get("/admin/login", isAdminloggedIn, loadPasskey);
adminRouter.post("/admin/login", admin_login);

// adminRouter.get('/admin/editProfile',editProfile)

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

adminRouter.get("/admin/add_product", loadAdd_product);

adminRouter.get("/admin/category", categoryLoad);

adminRouter.post("/admin/upload", upload.array("photos", 15), productAdd);
adminRouter.get("/admin/userDetails", userDetails);

adminRouter.get("/admin/addCategory", addCategoryLoad);
adminRouter.post("/admin/addCategory", addCategory);

adminRouter.get("/admin/editCategory/:id", categoryEdit);
adminRouter.post("/admin/editCategory/:id", Editcatgory);

adminRouter.get("/admin/category/delete/:id", categorydlt);

adminRouter.get("/admin/edit/:id",editAdmin)
adminRouter.post('/admin/edit/:id',profileEdit)

adminRouter.get("/admin/products", getAllProducts);

adminRouter.get("/admin/product/edit/:id", editProduct);
adminRouter.post("/admin/product/edit/:id", upload.array("photos"), productEdit)
adminRouter.post('/admin/product/:productId/delete-image',imageDlt)
adminRouter.post('/admin/product/listing/:id',productListing)

adminRouter.get("/admin/brand", brandList);

adminRouter.get("/admin/brand/edit/:id", loadEditBrand);
adminRouter.post("/admin/brand/edit/:id", editBrand);

adminRouter.get("/admin/brand/add", loadBrandAdd);
adminRouter.post("/admin/brand/add", addBrand);

adminRouter.post("/admin/brand/update-status/:id", updateStatus);

export default adminRouter;
