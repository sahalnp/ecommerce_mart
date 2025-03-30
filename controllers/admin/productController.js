import { product } from "../../models/productModel.js"
import asyncHandler from "express-async-handler"
import {imageModel} from "../../models/imageModel.js"
import {genderModel} from "../../models/genderCategoryModel.js"
import { categoryModel } from "../../models/categoryModel.js"


export const productAdd = asyncHandler(async (req, res) => {
    
    if (!req.file) {
       return res.status(404).json({ error: "NOT FOUND" });
    } else {
        const filename = req.file.originalname;
        const filepath = req.file.path;

        
        const basePath = `${req.protocol}://${req.get('host')}/views/uploads`;
        
        const { title, productPrice, salePrice, brand, description, size, category, genderCategory } = req.body;
        const genderdoc= await genderModel.findOne({name:genderCategory})
        const typedoc= await categoryModel.findOne({name:category})
        console.log(genderdoc,typedoc,"8520");
        
       
        const isListed=true;
        const inStock=true;
        
        const savedImage = await imageModel.create({
            filename,
            filepath: basePath + filename
        });
        
        const image = [savedImage._id]; 
        
        const findProduct = await product.findOne({
            title,
            productPrice,
            salePrice,
            brand,
            description,
            size,
            category: typedoc._id,
            genderCategory: genderdoc._id,
            isListed,
            inStock,
            image: image, 
        });
        
        console.log(findProduct,"7410");
        
        if (findProduct) {
            return res.status(400).json("The product already exists");
        }
        
        
        const newProduct = await product.create({
            title,
            productPrice,
            salePrice,
            brand,
            description,
            size,
            category:typedoc._id,
            genderCategory:genderdoc._id,
            isListed,
            inStock,
            image
        });
        console.log(newProduct,"dsfkljfk");
        
        res.status(201).json(newProduct);
    }
});
