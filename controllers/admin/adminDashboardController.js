import { User } from "../../models/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { admin } from "../../models/adminModel.js";
import { Order } from "../../models/orderModel.js";
import { review } from "../../models/reviewModel.js";

export const profileEdit = asyncHandler(async (req, res) => {
    const { firstname, Lastname, email, number } = req.body;
    await admin.findByIdAndUpdate(req.params.id, {
        Fistname: firstname,
        Lastname,
        email,
        number,
    });
    return res.redirect("/admin/dashboard");
});

export const userEdit = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const value = await User.findById(id);
    let hashedPassword = value.password;

    if (req.body.password) {
        hashedPassword = await bcrypt.hash(req.body.password, 10);
    }

    await User.findByIdAndUpdate(
        { _id: id },
        {
            $set: {
                Firstname: req.body.firstname,
                Lastname: req.body.Lastname,
                email: req.body.email,
                number: req.body.number,
                password: hashedPassword,
                status: req.body.status,
            },
        },
        { new: true }
    );

    res.redirect("/admin/userDetails");
});
export const userDelete = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await User.findByIdAndUpdate(id, {
        isDlt: true,
        status: false,
    });
    res.redirect("/admin/userDetails");
});
export const adminDelete = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await admin.findByIdAndUpdate(id, {
        isDlt: true,
        status: false,
    });
    res.redirect("/admin/userDetails");
});
export const adminsEdit = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        const value = await admin.findById(id);
        let hashedPassword = value.password;
        if (req.body.password) {
            hashedPassword = await bcrypt.hash(req.body.password, 10);
        }
        const status = req.body.status === "on" ? true : false;

        const updated = await admin.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    Firstname: req.body.firstname,
                    Lastname: req.body.Lastname,
                    email: req.body.email,
                    number: req.body.number,
                    password: hashedPassword,
                    status,
                },
            },
            { new: true }
        );
        res.redirect("/admin/admins/details");
    } catch (error) {
        console.log(error);
    }
});

export const userStatus = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
    });
    res.redirect("/admin/userDetails");
});
export const adminStatus = asyncHandler(async (req, res) => {
    await admin.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
    });
    res.redirect("/admin/admins/details");
});
export const editOrderStatus = asyncHandler(async (req, res) => {
    const id=req.params.id
    await Order.findByIdAndUpdate(
    {_id:id},
    { status: req.body.status },
    { new: true }
    )
    
    res.redirect('/admin/orders')
});
export const editOrderPaymentStatus = asyncHandler(async (req, res) => {  
    const id=req.params.id
    await Order.findByIdAndUpdate(
    {_id:id},
    { paymentStatus: req.body.paymentStatus },
    { new: true }
    )
    res.redirect('/admin/orders')
});
export const reviewStatus=asyncHandler(async(req,res)=>{
    const id = req.params.id
    await review.findByIdAndUpdate(
    {_id:id},
    { status: req.body.status },
    { new: true }
    )
    res.redirect('/admin/reviews')
})
