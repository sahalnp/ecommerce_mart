export const isAdminloggedIn = (req, res,next) => {
    if ( req.session.admin && req.session) {
      return res.redirect("/admin/dashboard");
    }
    next();
  };
  