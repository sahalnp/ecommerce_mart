// import { User } from "../models/userModel.js";

// export const userCheck = async (req, res, next) => {
//     try {
//         const user = await User.findOne({ _id: req.session.users._id, isDlt: false });

//         if (user) {
//             next();
//         } else {
//             res.redirect("/login");
//         }
//     } catch (err) {
//         console.error("Error in userCheck middleware:", err);
//         res.redirect("/login");
//     }
// };
// export const forgortPsscheck=async(req,res,next)=>{
//     const user=await User.findOne({email:req.session})
// }
