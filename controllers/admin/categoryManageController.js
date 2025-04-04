import asyncHandler from "express-async-handler";
import { categoryModel } from "../../models/categoryModel.js";
export const addCategory = asyncHandler(async (req, res) => {
    const catFind = await categoryModel.findOne({ name: req.body.categories });
    if (!catFind) {
        await categoryModel.create({ name: req.body.categories });
        return res.redirect("/admin/add_product"); // Redirect only if the category is successfully added
    }

    // If category already exists, render with error message
    res.render("admin/page/addCategory", {
        admin: req.session.admin,
        message: "Duplicate cannot be added",
    });
});
