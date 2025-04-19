import { product } from "../../models/productModel.js";
import asyncHandler from "express-async-handler";
import { imageModel } from "../../models/imageModel.js";

import { categoryModel } from "../../models/categoryModel.js"; // Import category model


export const productAdd = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(404).json({ error: "No files uploaded" });
    }

    let filenames = [];
    req.files.forEach(file => {
        filenames.push(file.originalname);  
        console.log("Uploaded file:", file.originalname);
    });


    if (filenames.length === 0) {
        return res.status(400).json({ error: "No valid image filenames found" });
    }

    try {
        const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;
        const imageIds = [];

        for (let file of req.files) {
            const savedImage = await imageModel.create({
                filename: file.filename,  
                filepath: `${basePath}/${file.filename}`,
            });
            imageIds.push(savedImage._id);
        }
        console.log(imageIds,"74189526");
        

        // Continue with your product creation logic
        const { title, productPrice, salePrice, brand, description, genderCategory } = req.body;
        const sizes = JSON.parse(JSON.stringify(req.body.sizes));
        const categorys = req.body.categorybox;

        const typedoc = await categoryModel.find({
            name: { $in: categorys },
        });

        const categoryIds = typedoc.map((category) => category._id);

        const isListed = true;
        const inStock = true;

        const findProduct = await product.findOne({
            title,
            productPrice,
            salePrice,
            brand,
            description,
            size: sizes,
            category: categoryIds,
            genderCategory,
            isListed,
            inStock,
            image: imageIds, 
            isActive: true,
        });

        if (findProduct) {
            return res.status(400).json("The product already exists");
        }

        // const newProduct = await product.create({
        //     title,
        //     productPrice,
        //     salePrice,
        //     brand,
        //     description,
        //     size: sizes,
        //     category: categoryIds,
        //     genderCategory,
        //     isListed,
        //     inStock,
        //     image: imageIds,  
        //     isActive: true,
        // });

        res.redirect("/admin/dashboard"); 
    } catch (err) {
        console.error("Error during product creation:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export const getAllProducts = asyncHandler(async (req, res) => {
    try {
        
        const findAll = await product.find({});
        res.render("admin/page/productListAdmin", {
            admin: req.session.admin,
            products: findAll,
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

    export const editProduct= asyncHandler(async(req,res)=>{
        
        const id=req.params.id      
        const findProduct= await product.findOne({_id:id})

        console.log(findProduct);
        
            res.render('admin/page/productEdit',{product:findProduct,admin:req.session.admin})
    })