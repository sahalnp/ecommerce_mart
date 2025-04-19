import asyncHandler from "express-async-handler";
import { categoryModel } from "../../models/categoryModel.js";
export const addCategory = asyncHandler(async (req, res) => {
    const catFind = await categoryModel.findOne({ name: req.body.categories });
    if (!catFind) {
        await categoryModel.create({ name: req.body.categories });
        return res.redirect("/admin/category");
    }
    res.render("admin/page/addCategory", {
        admin: req.session.admin,
        message: "Duplicate cannot be added",
    });
});
export const categoryEdit = asyncHandler(async (req, res) => {
    if (req.session.admin) {
        const catfind = await categoryModel.findById({ _id: req.params.id });
        res.render("admin/page/adminCategoryEdit", {
            category: catfind,
            admin: req.session.admin,
        });
    }
});

export const Editcatgory = asyncHandler(async (req, res) => {
    let islist = false;
    if (req.body.isListed == "on") {
        islist = true;
    }

    const { name, isListed } = req.body;
    const changed = await categoryModel.findByIdAndUpdate(req.params.id, {
        name,
        isListed: islist,
    });
    console.log(changed);

    return res.redirect("/admin/category");
});
export const categorydlt = asyncHandler(async (req, res) => {
    const changCat = await categoryModel.findByIdAndUpdate(req.params.id,{isDlt:true})
    res.redirect('/admin/category')
});
