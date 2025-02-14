export const home=(req,res)=>{
     res.render("index");
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
        user: req.user || {}, // Ensures user is at least an empty object
        orders: req.orders || [], // Ensures orders is at least an empty array
        role:null,
        place:null,
        Country:null,
        state:null,
        post:null,
    });
}
export const phoneotp=(req,res)=>{
    console.log((req.session.user.number));
    res.render("phoneotp",{phone:null,error:null})
}