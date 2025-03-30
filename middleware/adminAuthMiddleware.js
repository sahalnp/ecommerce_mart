export const isAdminloggedIn = (req, res,next) => {
    if (req.isAuthenticated() || req.session.admin) {
      return res.redirect("/admin/dashboard");
    }
    next();
  };
  