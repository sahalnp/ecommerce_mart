export const isUserloggedIn = (req, res) => {
    if (req.isAuthenticated() || req.session.users) {
      return res.redirect("/");
    }
    res.render("users/Auth/login", { title: "Login-M4 Watch", error: null });
  };
  export const isAdminloggedIn = (req, res,next) => {
    if ( req.session.admin && req.session) {
      return res.redirect("/admin/dashboard");
    }
    next();
  };
