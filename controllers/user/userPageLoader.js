import asyncHandler from "express-async-handler";
import { product } from "../../models/productModel.js";

export const loadEditProfile = asyncHandler(async (req, res) => {
    if (req.session.users) {
        res.render("users/profileEdit", {
            user: req.session.users,
            username: req.session.username,
        });
    }
    res.redirect("/login");
});

export const laodShop = asyncHandler(async (req, res) => {
    if (req.session.users) {
        const find = await product.find().populate('image');
        return res.render("users/page/shop", {
            username: req.session.username,
            product: find,
        });
    }
    return res.redirect("/login");
});
export const laodProduct=asyncHandler(async(req,res)=>{
    if(req.session.admin){
        const find=await product.findById(req.params.id).populate('image').populate('brand')
        const percent = Math.floor(((find.pricing.price - find.pricing.salePrice) / find.pricing.price) * 100);
        
        res.render('users/page/productDetails',{
            username:req.session.username,
            product:find,
            discount:percent
        })
    }
})
export const addTocart=asyncHandler(async(req,res)=>{
    if(req.session.admin){
        res.render('users/page/cart',{
            username:req.session.username
        })
    }
})
export const about=asyncHandler(async(req,res)=>{
    if(req.session.admin){
        res.render('users/page/about',{
            username:req.session.username
        })
    }
})
export const blog=asyncHandler(async(req,res)=>{
    if(req.session.admin){
        res.render('users/page/blog',{
            username:req.session.username
        })
    }
})
export const blogDetails=asyncHandler(async(req,res)=>{
    if(req.session.admin){
        res.render('users/page/blog-details',{
            username:req.session.username
        })
    }
})
export const elements=asyncHandler(async(req,res)=>{
    if(req.session.admin){
        res.render('users/page/elements',{
            username:req.session.username
        })
    }
})
export const confirmaton=asyncHandler(async(req,res)=>{
    if(req.session.admin){
        res.render('users/page/confirmation',{
            username:req.session.username
        })
    }
})
export const checkout=asyncHandler(async(req,res)=>{
    if(req.session.admin){
        res.render('users/page/checkout',{
            username:req.session.username
        })
    }
})
export const contact=asyncHandler(async(req,res)=>{
    if(req.session.admin){
        res.render('users/page/contact',{
            username:req.session.username
        })
    }
})