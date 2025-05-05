export const isUserloggedIn = (req, res) => {
    if (req.isAuthenticated() || req.session.users) {
      return res.redirect("/");
    }
    res.render("users/login", { title: "Login-M4 Watch", error: null });
  };
  