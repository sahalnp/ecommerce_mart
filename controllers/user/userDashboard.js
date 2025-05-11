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

    const find = await Cart.find({
        UserId: UserId,
        productId: productId,
    });
    let show=false
    const exist = await Cart.find({ productId });
    if (exist){
        show:true
    }
    await Cart.create({
        UserId,
        productId,
        quantity: req.body.quantity,
        exist:show
    });
    res.redirect("/cart");
});
export const addTowhish = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const userId=req.session.users._id
    console.log(req.params.id);
    
    try {
        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { wishList: productId } },
            { new: true }
        );
        
          res.json({ success: true });
          

    } catch (error) {
        console.log("Failed to add in the wishlist",error);
        res.status(500).json({ success: false, message: "Failed to add to wishlist" });
    }
});
export const removeFromWish = asyncHandler(async (req, res) => {
    try {
    const productId = req.params.id;
    const userId =req.session.users._id;  
    await User.findByIdAndUpdate(userId, {
        $pull: { wishList: productId },
    },
    {new:true}
);
    
    res.json({ success: true });
    } catch (error) {
        console.log(error,"ERROR");
        
    }
});
