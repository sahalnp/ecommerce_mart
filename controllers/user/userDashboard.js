import asyncHandler from "express-async-handler";
import { User } from "../../models/userModel.js";
import { product } from "../../models/productModel.js";
import { Cart } from "../../models/cartModel.js";

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
    await Cart;
    const UserId = req.session.users._id;
    const productId = req.body.productId;

    await Cart.create({
        UserId,
        productId,
        quantity: req.body.quantity,
    });
    res.redirect("/cart");
});
export const addTowhish = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const userId = req.session.users._id;
    console.log(req.params.id);

    try {
        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { wishList: productId } },
            { new: true }
        );

        res.json({ success: true });
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
export const quantchnge=asyncHandler(async(req,res)=>{
   try {
    const { productId, quantity } = req.body;
    const UserId=req.session.users._id
    const updatedItem = await Cart.findOneAndUpdate(
        { UserId, productId },
        { quantity: quantity },
        { new: true }
    );
     res.json({ message: 'Quantity updated' });
   } catch (error) {
     console.log(error,"Quantity doesnot changed");  
   }
})
export const checkout = asyncHandler(async (req, res) => {
    const find = await User.findById(req.session.users._id);
    req.session.address = find.addresses;
});
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
