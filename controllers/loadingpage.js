    import passport from "passport";
    export const home=(req,res)=>{
        let username="LOGIN";
        if(req.session.user){
            username=req.session.user.firstname+" "+req.session.user.Lastname
        }
        res.render("index",{username:username});
    }
    export const loadLogin=(req,res)=>{
        
        res.render('login',{title:"Login",user:null})
    }
    export const loadsignup=(req,res)=>{
        res.render('signup.ejs',{title:"Signup-Edumart",user:null})
    }
    export const otp=(req,res)=>{
        res.render('otp',{title:"OTP",error:null})
    }
    export const account=(req,res)=>{
        res.render('account.ejs', { 
            title: "ACCOUNT", 
            user: req.user || {}, 
            orders: req.orders || [], 
            role:null,
            place:null,
            Country:null,
            state:null,
            post:null,
        });
    }
    export const phoneotp=(req,res,next)=>{
        res.render("phoneotp",{phone: req.session.newnumber,error:null})
    }
    export const auth_google= passport.authenticate("google", { scope: ["profile", "email"] });

    export const auth_google_callback = (req, res, next) => {
        
      passport.authenticate("google", { failureRedirect: "/login" })(req, res, () => {  
        req.session.userexist=req.user 
        req.session.save();
        if (req.user) {  
            res.redirect("/");
        } else {
            res.render('login',{title:"Login",user:"User doesn't exist:Please signup"})
        }
      });
    };