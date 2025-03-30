
import asyncHandler from "express-async-handler"
import {categoryModel} from "../../models/categoryModel.js"
import {genderModel } from "../../models/genderCategoryModel.js"
export const addCategory=asyncHandler(async(req,res)=>{
    console.log(req.body.categories,req.body.gender_category,"dkfskfjdkslfjs");
    const categry=await categoryModel.create(req.body.categories)
    console.log(categry,"1741");
    
   // const gendercat=await genderModel.create(req.body.gender_category)
    res.redirect('/admin/add_product')
})
