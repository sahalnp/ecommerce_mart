export const isUserloggedIn=(req,res)=>{    
    if(req.session.user){
        return res.redirect('/')
    }
        res.render("login", { title: "Login-Edumart", user: null })
}
export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
