import {
    load_adminSignup,
    adminDashboard,
    admin_Otp,
    loadPasskey,
    loadUser_Edit,
    adminLogout,
    userDetails,
    editAdmin,
    loadAdminDetails,
    loadAdminEdit,
    loadOrder,
    viewOrder,
    loadReview,
    loadBanner,
    loadAddBanner,
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
    profileEdit,
    userStatus,
    adminStatus,
    adminsEdit,
    adminDelete,
    editOrderStatus,
    editOrderPaymentStatus,
    reviewStatus,

} from "../controllers/admin/adminDashboardController.js";

import {
    editProduct,
    getAllProducts,
    imageDlt,
    loadAdd_product,
    productAdd,
    productEdit,
    productListing,
    vrImageDlt,
} from "../controllers/admin/productController.js";
import { isAdminloggedIn} from "../middleware/adminAuthMiddleware.js";
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

adminRouter.get("/admin/login", loadPasskey);
adminRouter.post("/admin/login", admin_login);

adminRouter.post("/admin/login/passkey", passkeySend);

adminRouter.get("/admin/signup", load_adminSignup);
adminRouter.post("/admin/signup", adminSignup);

adminRouter.get("/admin/otp",admin_Otp);
adminRouter.post("/admin/otp", verify_adminOtp);

adminRouter.get("/admin/logout", adminLogout);
adminRouter.get("/admin/dashboard", isAdminloggedIn, adminDashboard);

adminRouter.get("/admin/edit-user/:id", isAdminloggedIn,loadUser_Edit);
adminRouter.post("/admin/edit-user/:id", userEdit);

adminRouter.post("/admin/delete-user/:id",userDelete);
adminRouter.post("/admin/profile/:id", editAdmin);

adminRouter.get("/admin/add_product", isAdminloggedIn, loadAdd_product);

adminRouter.get("/admin/category",  isAdminloggedIn,categoryLoad);
adminRouter.post(
  "/admin/upload",
  upload.fields([
    { name: "photos", maxCount: 15 },   
    { name: "vrImage", maxCount: 1 }   
  ]),
  productAdd
);

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
adminRouter.post(
  "/admin/product/edit/:id",
  upload.fields([
    { name: "images", maxCount: 10 },   
    { name: "vrImage", maxCount: 1 }     
  ]),
  productEdit
);


adminRouter.post('/admin/product/delete-image',imageDlt)
adminRouter.post('/admin/product/listing/:id',productListing)

adminRouter.get("/admin/brand", isAdminloggedIn, brandList);

adminRouter.get("/admin/brand/edit/:id",  isAdminloggedIn,loadEditBrand);
adminRouter.post("/admin/brand/edit/:id", editBrand);

adminRouter.get("/admin/brand/add",  isAdminloggedIn,loadBrandAdd);
adminRouter.post("/admin/brand/add", addBrand);
adminRouter.post('/admin/product/delete-vrImage',vrImageDlt)

adminRouter.post("/admin/brand/update-status/:id", updateStatus);
adminRouter.post('/admin/user/update-status/:id',userStatus)

adminRouter.get("/admin/admins/details", isAdminloggedIn,loadAdminDetails);

adminRouter.get('/admin/edit-admin/:id',isAdminloggedIn,loadAdminEdit)
adminRouter.post('/admin/edit-admin/:id',adminsEdit)
adminRouter.post('/admin/admins/update-status/:id',adminStatus)
adminRouter.post("/admin/delete-admin/:id",adminDelete);

adminRouter.get('/admin/orders',isAdminloggedIn,loadOrder)
adminRouter.get('/admin/orders/view/:id',isAdminloggedIn,viewOrder)
adminRouter.post('/admin/orders/editOrder/:id',editOrderStatus)
adminRouter.post('/admin/orders/updatePaymentStatus/:id',editOrderPaymentStatus)

adminRouter.get('/admin/reviews',isAdminloggedIn,loadReview)
adminRouter.post('/admin/reviews/update-status/:id',reviewStatus)

adminRouter.get('/admin/banners',isAdminloggedIn,loadBanner)
adminRouter.get('/admin/banner/add',isAdminloggedIn,loadAddBanner)

export default adminRouter;