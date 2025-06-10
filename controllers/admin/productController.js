import { product } from "../../models/productModel.js";
import asyncHandler from "express-async-handler";
import { imageModel } from "../../models/imageModel.js";
import { admin } from "../../models/adminModel.js";
import { categoryModel } from "../../models/categoryModel.js";
import { brandModel } from "../../models/brandModel.js";

export const loadAdd_product = async (req, res) => {
    const admminData = await admin.findOne({ _id: req.session.admin._id });
    let categories = await categoryModel.find();
    let brands = await brandModel.find();

    if (req.session.admin) {
        res.render("admin/page/adminAddProduct", {
            csrfToken: req.csrfToken(),
            admin: admminData,
            brands,
            categories,
            activePage: "adminAddProduct",
        });
    } else {
        return res.redirect("/admin/login");
    }
};

export const productAdd = asyncHandler(async (req, res) => {
 if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: "No files were uploaded." });
  }
  let filenames = [];
  for (const fieldName in req.files) {

    req.files[fieldName].forEach((file) => {
      filenames.push(file.originalname);
      console.log("Uploaded file:", file.originalname);
    });
  }
  if (filenames.length === 0) {
    return res
      .status(400)
      .json({ error: "No valid image filenames found." });
  }

  try {

    const basePath = `${req.protocol}://${req.get("host")}/uploads`;
    const imageIds = [];    
    let vrImageId = null;    

    const productImages = req.files["photos"] || [];
    for (const file of productImages) {
      const savedImage = await imageModel.create({
        filename: file.filename,
        filepath: `${basePath}/${file.filename}`,
      });
      imageIds.push(savedImage._id);
    }
    const vrFiles = req.files["vrImage"] || [];
    if (vrFiles.length > 0) {
      const vrFile = vrFiles[0];
      const savedVRImage = await imageModel.create({
        filename: vrFile.filename,
        filepath: `${basePath}/${vrFile.filename}`,
      });
      vrImageId = savedVRImage._id;
    }
        const {
            title,
            productPrice,
            salePrice,
            description,
            genderCategory,
            bandColour,
            bandMaterial,
            warranty,
            movementType,
            itemWeight,
            countryOrigin,
            modelNumber,
            caseShape,
            specialFeatures,
            modelYear,
            caseDiameter,
            inStock,
        } = req.body;

        //Getting category id
        const typedoc = await categoryModel.find({
            name: { $in: req.body.categorybox },
        });
        const categoryIds = typedoc.map((category) => category._id);

        const brandDoc = await brandModel.findOne({ name: req.body.brandbox });

        if (!brandDoc) {
            return res.status(400).json({ error: "Invalid brand selected" });
        }

        const brandIds = brandDoc._id;

        const isListed = true;

        const findProduct = await product.findOne({
            title,
            pricing: {
                price: productPrice,
                salePrice,
            },
            brand: brandIds,
            description,
            bandColour,
            bandMaterial,
            warranty,
            movementType,
            itemWeight,
            countryOrigin,
            modelNumber,
            caseShape,
            specialFeatures,
            modelYear,
            caseDiameter,
            category: categoryIds,
            genderCategory,
            isListed,
            inStock,
            image: imageIds,
            vrImage:vrImageId,
            isActive: true,
        });

        if (findProduct) {
            return res.status(400).json("The product already exists");
        }

        await product.create({
            title,
            pricing: {
                price: productPrice,
                salePrice,
            },
            brand: brandIds,
            description,
            bandColour,
            bandMaterial,
            warranty,
            movementType,
            itemWeight,
            countryOrigin,
            modelNumber,
            caseShape,
            specialFeatures,
            modelYear,
            caseDiameter,
            category: categoryIds,
            genderCategory,
            isListed,
            inStock,
            image: imageIds,
            vrImage:vrImageId,
            isActive: true,
        });

        res.redirect("/admin/dashboard");
    } catch (err) {
        console.error("Error during product adding:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const findAll = await product.find().populate("image");

        res.render("admin/page/productListAdmin", {
            admin: req.session.admin,
            products: findAll,
            activePage: "productListAdmin",
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

export const editProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const findProduct = await product.findOne({ _id: id }).populate("brand").populate("category").populate("image").populate('vrImage');

    const fndBrand = await brandModel.find();
    const fndCat = await categoryModel.find();
    res.render("admin/page/productEdit", {
        product: findProduct,
        admin: req.session.admin,
        activePage: "productEdit",
        brand: fndBrand,
        categry: fndCat,

    });
});

export const productEdit = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        const existingProduct = await product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        const basePath = `${req.protocol}://${req.get("host")}/uploads`;
         const imageIds = [];
        if (req.files && req.files.images) {
            for (let file of req.files.images) {
                const savedImage = await imageModel.create({
                    filename: file.filename,
                    filepath: `${basePath}/${file.filename}`,
            });
            imageIds.push(savedImage._id);
            }
        }
        
        const existingImageIds = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : req.body.existingImages
        ? [req.body.existingImages]
        : [];
        //VR
        let vrImageId = null;
        if (req.files && req.files.vrImage && req.files.vrImage[0]) {
            const vrFile = req.files.vrImage[0];
            const savedVRImage = await imageModel.create({
                filename: vrFile.filename,
                filepath: `${basePath}/${vrFile.filename}`,
            });
            vrImageId = savedVRImage._id;
        } else if (req.body.existingVrImage) {
            vrImageId = req.body.existingVrImage;
        }
        

        const allImageIds = [...existingImageIds, ...imageIds];

        const {
            title,
            productPrice,
            salePrice,
            description,
            genderCategory,
            bandColour,
            bandMaterial,
            warranty,
            movementType,
            itemWeight,
            countryOrigin,
            modelNumber,
            caseShape,
            specialFeatures,
            modelYear,
            caseDiameter,
            inStock,
        } = req.body;

        const isList = req.body.isListed === "on" ? true : false;
        const categoryDocs = await categoryModel.find({
            name: { $in: req.body.categorybox },
        });
        const categoryIds = categoryDocs.map((category) => category._id);
        const brandDoc = await brandModel.findById(req.body.brandradio);
        if (!brandDoc) {
            return res.status(400).json({ error: "Invalid brand selected" });
        }
        await product.findByIdAndUpdate(id, {
            title,
            pricing: {
                price: productPrice,
                salePrice: salePrice,
            },
            brand: brandDoc._id,
            description,
            bandColour,
            bandMaterial,
            warranty,
            movementType,
            itemWeight,
            countryOrigin,
            modelNumber,
            caseShape,
            specialFeatures,
            modelYear,
            caseDiameter,
            category: categoryIds,
            genderCategory,
            isListed:isList,
            inStock,
            image: allImageIds,
            vrImage:vrImageId, 
            isActive: true,
        });
        res.redirect("/admin/products");
    } catch (error) {
        console.error("Error during product update:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
export const productListing=asyncHandler(async(req,res)=>{
    const { id } = req.params;
    const { isListed } = req.body;
    await product.findByIdAndUpdate(id, { isListed: isListed === 'true' });
    res.redirect('/admin/products'); 
});
export const imageDlt = asyncHandler(async (req, res) => {
    const { productId, imageId } = req.body;
    try {
        await product.findByIdAndUpdate(
            productId,
            { $pull: { image: imageId } },
            { new: true }
        )
        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
export const vrImageDlt=asyncHandler(async(req,res)=>{
    const {productId,imageId}=req.body
    await product.findByIdAndUpdate(
    productId,
    { $unset: { vrImage: 1 } }, 
    { new: true }
    );

        

})