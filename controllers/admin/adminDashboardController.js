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
    console.log(req.body.status,"sdfghjjvcvbn");
    
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
                status:req.body.status
            },
        },
        { new: true }
    );

    console.log(updated,"qwertyuio");

    res.redirect("/admin/userDetails");
});
export const userDelete = asyncHandler(async (req, res) => {  
    const userid = req.params.id;
    const finds=await User.findById('681f35aa5ce97761c32b8f2a')
    const find=await User.findByIdAndUpdate(userid,{isDlt:true})
    console.log(find,"wertyu");
    res.redirect('/admin/userDetails')
    
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

export const userStatus=asyncHandler(async(req,res)=>{
    console.log(req.body.status);
    
    const find = await User.findByIdAndUpdate(req.params.id,{status:req.body.status});
    console.log(find);
    
    res.redirect('/admin/userDetails')

})