import { User } from "../../models/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { admin } from "../../models/adminModel.js";

export const profileEdit = asyncHandler(async (req, res) => {
    if(req.session.admin){
    const { fistname, Lastname, email, number } = req.body;
    const change=await admin.findByIdAndUpdate(req.params.id,{fistname,Lastname,email,number})
    console.log(change,"3456789");
    
    return res.redirect('/admin/dashboard')
    }
    return res.redirect('admin/login')
});

export const userEdit = asyncHandler(async (req, res) => {
    const userid = req.params.id;
    const value = await User.findOne({ _id: userid });

    let hashedPassword = value.password;

    if (req.body.password) {
        hashedPassword = await bcrypt.hash(req.body.password, 10);
    }

    const updated = await User.findByIdAndUpdate(
        { _id: userid },
        {
            $set: {
                firstname: req.body.firstname,
                Lastname: req.body.Lastname,
                email: req.body.email,
                number: req.body.number,
                password: hashedPassword,
            },
        },
        { new: true }
    );

    console.log(updated);

    res.redirect("/admin/dashboard");
});
export const userDelete = asyncHandler(async (req, res) => {
    const userid = req.params.id;

    await User.findOneAndDelete({
        _id: userid,
    });
});
export const adminEdit = asyncHandler(async (req, res) => {
    const adminid = req.params.id;
    const value = await admin.findOne({ _id: adminid });
    let hashedPassword = value.password;
    if (req.body.password) {
        hashedPassword = await bcrypt.hash(req.body.password, 10);
    }
    const updated = await admin.findByIdAndUpdate(
        { _id: adminid },
        {
            $set: {
                firstname: req.body.firstname,
                Lastname: req.body.Lastname,
                email: req.body.email,
                number: req.body.number,
                password: hashedPassword,
            },
        },
        { new: true }
    );
    console.log("Updated", updated);
    res.redirect("/admin/userDetails");
});
