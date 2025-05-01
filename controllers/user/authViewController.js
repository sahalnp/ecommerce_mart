
import passport from "passport";
export const home = (req, res) => {
    if (req.session.users) {
        username = req.session.users.firstname + " " + req.session.users.Lastname;
        if (req.session.user_name) {
            username = req.session.user_name;
        }
    }
    res.render("users/index");
};
export const loadsignup = (req, res) => {
    res.render("users/signup.ejs", { title: "Signup-M4 Mart", user: null });
};
export const otp = (req, res) => {
    res.render("users/otp", { title: "OTP", error: null, time: 60 });
};
export const account = (req, res) => {
    
    res.render("users/account.ejs", {
        title: "ACCOUNT",
        user: req.session.users || {},
        orders: req.orders || [],
        role: null,
        place: null,
        Country: null,
        state: null,
        post: null,
    });
};
export const phoneotp = (req, res, next) => {
    res.render("users/phoneotp", {
        phone: req.session.newnumber,
        error: null,
        time: 60,
    });
};
export const auth_google = passport.authenticate("google", {
    scope: ["profile", "email"],
});

export const auth_google_callback = (req, res, next) => {
    passport.authenticate(
        "google",
        { failureRedirect: "/login" },
        (err, user) => {
            if (err || !user) {
                return res.render("login", {
                    title: "Login",
                    user: "User doesn't exist: Please sign up",
                });
            }

            req.logIn(user, (err) => {
                // Logs in user to persist session
                if (err) return next(err);

                req.session.user = user.profile.emails[0].value; // Store user in session
                req.session.user_name = user.profile.displayName;

                req.session.save(() => {
                    console.log("User stored in session:", req.session.user);
                    res.redirect("/");
                });
            });
        }
    )(req, res, next);
};
export const resetpass = (req, res) => {
    res.render("users/reset_pass", { title: "Reset Password" });
};
export const reset_pass_otp = (req, res) => {
    res.render("users/reset_pass_otp", {
        showOtpInput: null,
        error: null,
        email: null,
    });
};
export const pass_reset = (req, res) => {
    res.render("users/reset_pass");
};


