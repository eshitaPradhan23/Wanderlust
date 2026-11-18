const User = require("../models/user.js")


module.exports.renderSignUpPage = (req ,res) => {
    res.render("user/signup.ejs");
};


module.exports.signUpUser = async(req,res,next) =>{
    try{
        let { username, password } = req.body;
        const email = (req.body.email || "").trim() || undefined;
        const phone = (req.body.phone || "").trim() || undefined;

        if(!email && !phone){
            req.flash("error", "Please provide an email or a phone number");
            return res.redirect("/signup");
        }
        if(phone){
            const digits = phone.replace(/[\s-]/g, "");
            if(!/^\+?\d{7,15}$/.test(digits)){
                req.flash("error", "Please enter a valid phone number");
                return res.redirect("/signup");
            }
        }

        const newUser = new User({email, phone, username});
        const registerdUser = await User.register(newUser,password);
        console.log(registerdUser);
        req.login(registerdUser,(err) =>{
            if(err){
                return next(err);
            }
             req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
        });
       
    }catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
};


module.exports.renderloginPage = (req ,res) => {
    res.render("user/login.ejs");
}



module.exports.loginuser = async (req, res)=>{
    req.flash("success","Welcome back to WanderLust! you are logged in");
     let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
 };


 module.exports.logoutuser=(req, res, next) => {
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
       

        res.redirect("/listings")
    });
};