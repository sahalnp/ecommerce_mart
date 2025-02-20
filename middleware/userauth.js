export const isUserloggedIn = (req, res) => {
    if (req.isAuthenticated() || req.session.user) {
      return res.redirect("/");
    }
    
    res.render("login", { title: "Login-M4 Mart", user: null });
  };
  