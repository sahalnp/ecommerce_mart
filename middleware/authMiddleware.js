import { User } from "../models/userModel.js";

/**
 * Middleware to check if a user is logged in.
 * Redirects authenticated users to the home page.
 * Renders the login page with a title and no error message for unauthenticated users.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */

export const isUserloggedIn = async (req, res, next) => {
      const find = await User.findOne({
      _id: req.session.users._id,  // assuming _id is the correct field
      isDlt: false,
      status: true
    });
    
    if (req.isAuthenticated() || find) {
        next();
    }
    else{
      res.render("users/Auth/login", { title: "Login", error: null });
    }
    
    
};
export const isAdminloggedIn = (req, res, next) => {
    if (req.session.admin && req.session) {
        return res.redirect("/admin/dashboard");
    }
    next();
};
