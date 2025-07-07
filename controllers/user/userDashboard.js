import asyncHandler from "express-async-handler";
import { User } from "../../models/userModel.js";
import { product } from "../../models/productModel.js";
import { Cart } from "../../models/cartModel.js";
import { Compare } from "../../models/compareModel.js";
import { Order } from "../../models/orderModel.js";
import { review } from "../../models/reviewModel.js";
import bcrypt from "bcrypt";
import { Coupon } from "../../models/couponModel.js";

export const editProfile = asyncHandler(async (req, res) => {
    const { firstname, Lastname, email, number, gender, dob } = req.body;
    await User.findByIdAndUpdate(req.params.id, {
        firstname,
        Lastname,
        email,
        number,
        gender,
        dob,
    });
    return res.redirect(`/profile/${req.params.id}`);
});
export const changePass = asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    const user = await User.findById(req.params.id);
    const passwordMatch = await bcrypt.compare(newPassword, user.password);
    if (passwordMatch) {
        return res.status(400).json({ error: "This is old password try new" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: "Password changed successfully!" });
});

export const addtoCart = asyncHandler(async (req, res) => {
    const UserId = req.session.users._id;
    const { productId, quantity } = req.body;
    const find = await Cart.findOne({
        UserId: req.session.users._id,
        productId: productId,
    });
    const prodfind = await product.findOne({
        _id: productId,
        inStock: { $gt: 0 },
    });
    
    if (prodfind) {
        if (!find) {
            const myr=await Cart.create({
                UserId,
                productId,
                productName: prodfind.title,
                price: quantity * prodfind.pricing.salePrice,
                quantity,
            });
            
        }
    }
    res.redirect("/cart");
});
export const addTowhish = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const userId = req.session.users._id;

    try {
        const val = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { wishList: productId } },
            { new: true }
        );

        res.json({ success: true });
        return val;
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
        
        const prod = await product.findById(productId);
        const price = quantity * prod.pricing.salePrice;

        const UserId = req.session.users._id;
        if (quantity == 0) {
            await Cart.findOneAndDelete({
                UserId,
                productId,
            });
        } else {
            await Cart.findOneAndUpdate(
                { UserId, productId },
                {
                    quantity: quantity,
                    price: price,
                },
                { new: true }
            );
        }
        res.json({ message: "Quantity updated", success: true });
    } catch (error) {
        console.log(error, "Quantity doesnot changed");
    }
});
export const checkout = asyncHandler(async (req, res) => {
    const find = await User.findById(req.session.users._id);
    req.session.address = find.addresses;
});
export const cartDlt = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.body;
        await Cart.findOneAndDelete({ productId });
        res.json({ message: "lproduct deleted" });
    } catch (error) {
        console.log(error, "ERROR");
    }
});
export const addAddress = asyncHandler(async (req, res) => {
    const user=await User.findById(req.session.users._id)
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
            username: user.firstname.trim() + " " + user.Lastname.trim(),
            user,
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
    res.redirect(req.get("referer"));
});
export const dltAddress = asyncHandler(async (req, res) => {
    const find = await User.findById(req.session.users._id);
    const address = find.addresses.id(req.params.id);
    if (address) {
        address.status = false;
        await find.save();
        return res.redirect("/checkout");
    } else {
        return res.status(404).send("Address not found");
    }
});
export const updateAddress = async (req, res) => {
    const user = await User.findById(req.session.users._id);
    const { id } = req.params;
    
    const {
        name,
        number,
        addressType,
        street,
        localPlace,
        landmark,
        city,
        district,
        state,
        pincode,
        country,
    } = req.body;

    try {
        const address=user.addresses.id(id)
        
        address.name = name;
        address.number = number;
        address.addressType = addressType;
        address.street = street;
        address.localPlace = localPlace;
        address.landmark = landmark;
        address.city = city;
        address.district = district;
        address.state = state;
        address.pincode = pincode;
        address.country = country;

        res.redirect(`/profile/address/${user._id}`);
    } catch (error) {
        console.error("Failed to update address:", error);
        res.status(500).send(
            "Something went wrong while updating the address."
        );
    }
};

export const addCmp = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.body;
        const find = await product.findById(productId);
    } catch (error) {
        console.log(error, "ERROR");
    }
});
export const addcart = asyncHandler(async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const find = await product.findOne({
            UserId: req.session.users._id,
            productId,
            inStock: { $gt: 0 },
        });

        if (find) {
            res.json("already exist");
        } else {
            await product.create({
                productId,
                userId: req.session.users._id,
                quantity,
            });
        }
    } catch (error) {
        console.log(error, "error");
    }
});
export const buy = asyncHandler(async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const prod = await product.findById(productId);
        const find = await product.findOne({
            userId: req.session.users._id,
            productId,
            inStock: { $gt: 0 },
        });
        console.log(quantity);
        

        if (!find) {
            await Cart.create({
                UserId: req.session.users._id,
                productId,
                productName: prod.title,
                price: quantity * prod.pricing.salePrice,
                quantity,
            });
        }
        res.json({ success: true, redirectUrl: "/checkout" });
    } catch (error) {
        console.log("ERROR :", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
export const addCompare = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.body;
        const existing = await Compare.findOne({
            productId,
            userId: req.session.users._id,
        });

        if (existing) {
            return res.json({
                success: false,
                message: "Already in comparison list",
            });
        }

        await Compare.create({
            productId,
            UserId: req.session.users._id,
        });

        res.json({ success: true, message: "Added to comparison" });
    } catch (error) {
        console.log("ERROR in addCompare:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
export const cmpReset = asyncHandler(async (req, res) => {
    await Compare.deleteMany({});
    res.redirect("/shop");
});

export const cmpResetOne = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.body;
        const UserId = req.session.users._id;
        await Compare.findOneAndDelete({ UserId, productId }, { new: true });
        res.redirect("/compare");
    } catch (error) {
        console.log("ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
export const rating = asyncHandler(async (req, res) => {
    try {
        const { productId, rating } = req.body;
        if (!productId || ![1, 2, 3, 4, 5].includes(rating)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid input" });
        }

        const fieldToUpdate = `rating.${rating}`;
        const res = await product.updateOne(
            { _id: productId },
            { $inc: { [fieldToUpdate]: 1 } }
        );
        let totalUser = 0;
        let totalvalue = 0;
        let count = 0;
        const value = await product.findById(productId);

        const rate = value.rating;

        for (let i = 1; i <= 5; i++) {
            count = rate[i];
            totalvalue += i * count;
            totalUser += count;
        }
        let avg = totalvalue + totalUser;
        return avg;
    } catch (error) {
        console.log("ERROR :", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

export const reviewRighted = asyncHandler(async (req, res) => {
    const { title, desc, rating } = req.body;
    const userId = req.session.users._id;
    const productId = req.params.id;

    const hasOrdered = await Order.findOne({
        UserId: userId,
        "items.product": productId,
    });

    if (!hasOrdered) {
        return res
            .status(403)
            .send("You can't review a product you haven't purchased.");
    }

    const existingReview = await review.findOne({
        UserId: userId,
        productId,
        status: "Accepted",
    });

    if (existingReview) {
        if (title?.trim()) existingReview.title = title.trim();
        if (desc?.trim()) existingReview.description = desc.trim();
        if (rating) existingReview.rating = rating;
        existingReview.date = new Date();
        await existingReview.save();
    } else {
        await review.create({
            UserId: userId,
            productId,
            title: title?.trim() || "No Title",
            description: desc?.trim() || "No Description",
            rating: rating || 0,
            status: "pending",
            date: new Date(),
        });
    }
    res.redirect(`/MyOrder/${hasOrdered._id}`);
});
export const applyCoupon = asyncHandler(async (req, res) => {
    const { couponCode, subtotal } = req.body;
    const userId = req.session.users._id;
    const coupon = await Coupon.findOne({ code: couponCode, active: true });
    if (!coupon) {
        return res.status(404).json({ message: "No coupon exists" });
    }
    if (subtotal < coupon.minAmount) {
        return res
            .status(404)
            .json({ message: `Minimum amount ₹${coupon.minAmount} required.` });
    }
    const userEntry = coupon.usedBy.find(
        (p) => p.userId.toString() === userId.toString()
    );
    if (userEntry && userEntry.usageCount >= coupon.usageLimit) {
        return res.status(400).json({
            message: "You already used this coupon the maximum number of times.",
        });
    }
    if (userEntry) {
        userEntry.usageCount += 1;
    } else {
        coupon.usedBy.push({ userId, usageCount: 1 });
    }
    let discountAmount = subtotal * (coupon.discount / 100);
    if (discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
    }
    const finalDiscount = Math.min(discountAmount, coupon.maxDiscount);
    await coupon.save();
    res.json({
    code: coupon.code,
    discountPercent: coupon.discount,
    discountAmount: Number(finalDiscount.toFixed(2)),
    description: `Flat ${coupon.discount}% OFF`,
    message: `Coupon applied! You saved ₹${finalDiscount.toFixed(2)}`
});
});
export const removeCoupon = asyncHandler(async (req, res) => {
    const { couponCode } = req.body
    const userId = req.session.users._id;

    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) {
        return res.status(404).json({ error: "Coupon not found." });
    }
    const userUsage = coupon.usedBy.find(
        (e) => e.userId.toString() === userId.toString()
    );
    if (userUsage.usageCount > 1) {
        await Coupon.updateOne(
            { code: couponCode },
            {
                $inc: { "usedBy.$[elem].usageCount": -1 },
            },
            {
                arrayFilters: [{ "elem.userId": userId }],
            }
        );
    } else {
        await Coupon.updateOne(
            { code: couponCode },
            {
                $pull: { usedBy: { userId: userId } },
                $inc: { usageCount: -1 },
            }
        );
    }
   res.json({ message: "Coupon removed successfully." });

});
