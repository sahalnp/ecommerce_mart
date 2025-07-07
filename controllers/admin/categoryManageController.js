import asyncHandler from "express-async-handler";
import { categoryModel } from "../../models/categoryModel.js";
export const categoryLoad = asyncHandler(async (req, res) => {
    if (!req.session.admin) {
        return res.redirect("/admin/login");
    }
    if (req.body.search) {
        const categoryFnd = await categoryModel.findOne({
            category: req.body.search,
        });
        return res.render("admin/page/adminCategory", {
            catList: categoryFnd,
            admin:req.session.admin,
            dlt:false,
             activePage: 'adminCategory'
        });
    } else {
        const find = await categoryModel.find({});

        return res.render("admin/page/adminCategory", {
            catList: find,
            admin:req.session.admin,
            dlt:false,
             activePage: 'adminCategory'
        });
    }
});
export const addCategoryLoad = asyncHandler(async (req, res) => {
    if (!req.session.admin) {
        return res.redirect("/admin/login");
    }
    return res.render("admin/page/addCategory", {
        admin: req.session.admin,
        message: null,
         activePage: 'addCategory'
    });
});
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
        res.render("admin/page/CategoryEdit", {
            category: catfind,
            admin: req.session.admin,
            activePage: 'addCategoryEdit'
        });
    }
});

export const Editcatgory = async (req, res) => {
  try {
    const { name, isListed } = req.body;

     await categoryModel.findByIdAndUpdate(req.params.id, {
      name,
      isListed: isListed === "true" 
    });

    return res.redirect("/admin/category");
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const categorydlt = asyncHandler(async (req, res) => {
     await categoryModel.findByIdAndUpdate(req.params.id,{isDlt:true})
    res.redirect('/admin/category')
});
export const changeList=asyncHandler(async(req,res)=>{
     try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).send('Category not found');
    }
    category.isListed = !category.isListed;
    await category.save();

    res.redirect('/admin/category'); 
  } catch (error) {
    console.error('Error toggling category list status:', error);
    res.status(500).send('Internal Server Error');
  }
})