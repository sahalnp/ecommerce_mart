export const isUserloggedIn = (req, res) => {
    if (req.isAuthenticated() || req.session.user||req.session.user_email) {
      return res.redirect("/");
    }
    
    res.render("user/login", { title: "Login-M4 Mart", user: null });
  };
  