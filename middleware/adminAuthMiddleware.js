import { admin } from "../models/adminModel.js";
export const isAdminloggedIn = async (req, res, next) => {
    let admins;

    if (req.session.admin) {
        admins = await admin.findById(req.session.admin._id);
    }

    if (admins !== undefined && admins.status == true) {
        next();
    } else {
        res.redirect("/admin/login");
    }
};
export const isAdminLoggedOut = (req, res, next) => {
    if (req.session.admin) {
        return res.redirect("/admin/dashboard");
    }
    next();
};
