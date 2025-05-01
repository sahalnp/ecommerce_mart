import asyncHandler from "express-async-handler";
import { brandModel } from "../../models/brandModel.js";
export const brandList = asyncHandler(async (req, res) => {
    if (req.session.admin) {
        const find = await brandModel.find();

        res.render("admin/page/brandManagment", {
            admin: req.session.admin,
            brand: find,
            activePage: "brandManagement",
        });
    }
});
export const loadBrandAdd = asyncHandler(async (req, res) => {
    if (req.session.admin) {
        res.render("admin/page/addBrand", {
            message: null,
            activePage: "brandManagement",
        });
    }
});
export const addBrand = asyncHandler(async (req, res) => {
    const { brandName } = req.body;
    const find = await brandModel.findOne({ name: brandName });
    if (find) {
        return res.render("admin/page/addBrand", {
            message: "The Brand already exist",
            activePage: "brandManagement",
        });
    } else {
        await brandModel.create({name:brandName});
    }
    res.redirect('/admin/brand')
});
export const loadEditBrand = asyncHandler(async (req, res) => {
    const find = await brandModel.findById(req.params.id);
    res.render("admin/page/brandEdit", {
        activePage: "brandEdit",
        brand: find,
    });
});
export const editBrand= asyncHandler(async(req,res)=>{
   await brandModel.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          isListed: req.body.isListed 
        }
      );
    res.redirect('/admin/brand')
})
export const updateStatus=asyncHandler(async(req,res)=>{
    console.log(req.body.isListed);
    
    const find = await brandModel.findByIdAndUpdate(req.params.id,{isListed:req.body.isListed});
    console.log(find);
    
    res.redirect('/admin/brand')


})
