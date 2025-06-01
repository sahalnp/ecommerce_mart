import asyncHandler from "express-async-handler";
import { User } from "../../models/userModel.js";
import { product } from "../../models/productModel.js";
import { Cart } from "../../models/cartModel.js";
import { Compare } from "../../models/compareModel.js";
import { compare } from "bcrypt";

export const editProfile = asyncHandler(async (req, res) => {
    const { firstname, Lastname, email, number } = req.body;
    await User.findByIdAndUpdate(req.params.id, {
        firstname,
        Lastname,
        email,
        number,
    });
    return res.redirect("/");
});

export const addtoCart = asyncHandler(async (req, res) => {
    const UserId = req.session.users._id;
    const productId = req.body.productId;
    const find=await Cart.findOne({UserId,productId})
    const prodfind=await product.findById(productId)
    if (!find){
        await Cart.create({
        UserId,
        productId,
        productName:prodfind.title,
        quantity: req.body.quantity,
    });
    }
    res.redirect("/cart");
});
export const addTowhish = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const userId = req.session.users._id;
    console.log(req.params.id);

    try {
        const val=await User.findByIdAndUpdate(
            userId,
            { $addToSet: { wishList: productId } },
            { new: true }
        );
        
        res.json({ success: true });
        return val
    } catch (error) {
        console.log("Failed to add in the wishlist", error);
        res.status(500).json({
            success: false,
            message: "Failed to add to wishlist",
        });
    }
});
export const removeFromWish = asyncHandler(async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.session.users._id;
        await User.findByIdAndUpdate(
            userId,
            {
                $pull: { wishList: productId },
            },
            { new: true }
        );
        res.json({ success: true });
    } catch (error) {
        console.log(error, "ERROR");
    }
});
export const quantchnge = asyncHandler(async (req, res) => {
    
    try {
        const { productId, quantity } = req.body;
        const UserId = req.session.users._id;
        if(quantity==0){
            await Cart.findOneAndDelete({
                UserId,productId
            })
        }
        else{
            await Cart.findOneAndUpdate(
            { UserId, productId },
            { quantity: quantity },
            { new: true }
        );
        }
        res.json({ message: "Quantity updated" });
    } catch (error) {
        console.log(error, "Quantity doesnot changed");
    }
});
export const checkout = asyncHandler(async (req, res) => {
    const find = await User.findById(req.session.users._id);
    req.session.address = find.addresses;
});
export const cartDlt=asyncHandler(async(req,res)=>{
    try {
        const { productId } = req.body;
        await Cart.findOneAndDelete({ productId });
         res.json({ message: "lproduct deleted" });
    } catch (error) {
        console.log(error,"ERROR");
        
    }
})
export const addAddress = asyncHandler(async (req, res) => {
    const {
        name,
        number,
        street,
        localPlace,
        landmark,
        city,
        district,
        state,
        pincode,
        country,
        addressType,
    } = req.body;
    
    const find = await User.findById(req.session.users._id);
    
    const duplicate = find.addresses.find(
        (addr) =>
            addr.name === name &&
            addr.number === number &&
            addr.street === street &&
            addr.localPlace === localPlace &&
            addr.landmark === landmark &&
            addr.city === city &&
            addr.district === district &&
            addr.state === state &&
            addr.pincode === pincode &&
            addr.country === country &&
            addr.addressType === addressType
    );
    if (duplicate) {
        res.render("users/page/address", {
            username: req.session.userName,
            user: req.session.users,
            error: "The address exist.Please add new",
        });
    } else {
        find.addresses.push({
            name,
            number,
            street,
            localPlace,
            landmark,
            city,
            district,
            state,
            pincode,
            country,
            addressType,
        });
        await find.save();
    }
    res.redirect('/checkout')
});
export const addCart=asyncHandler(async(req,res)=>{
    console.log("dfghjkl");
    
    res.redirect('/cart')
})
export const addCmp=asyncHandler(async(req,res)=>{
    try {
        const {productId}=req.body
        const find=await product.findById(productId)
    } catch (error) {
        console.log(error,"ERROR");
        
    }
})
export const addcart=asyncHandler(async(req,res)=>{
    try {
        const {productId,quantity}=req.body
        const find=await product.findOne({userId:req.session.users._id,productId})
        if(find){
            res.json("already exist")
        }
        else{
            await product.create({
                productId,
                userId: req.session.users._id,
                quantity
            });
        }
    } catch (error) {
        console.log(error,"error");
        
    }
})
export const addCompare = asyncHandler(async (req, res) => {
    
  try {
    const { productId } = req.body;
    const existing = await Compare.findOne({
      productId,
      userId: req.session.users._id,
    });

    if (existing) {
      return res.json({ success: false, message: "Already in comparison list" });
    }

    await Compare.create({
      productId,
      UserId: req.session.users._id,
    });

    res.json({ success: true, message: "Added to comparison" });
  } catch (error) {
    console.log("ERROR in addCompare:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
export const cmpReset=asyncHandler(async(req,res)=>{
    await Compare.deleteMany({})
    res.redirect('/shop')
})

export const cmpResetOne = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.session.users._id; 
    await Compare.findOneAndDelete({productId,userId},{new:true});
    res.redirect('/compare');
  } catch (error) {
    console.log("ERROR in addCompare:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
