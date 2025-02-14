export const isUserloggedIn=(req,res,next)=>{
    if(req.session.user_emailornumber){
        res.redirect('/')
    }
        res.render("login", { title: "Login-Edumart", user: null })
}