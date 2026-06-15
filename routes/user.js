const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js")
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js")
const userController = require("../controller/users.js");

router.route("/signup")
.get( userController.renderSignUpPage )
.post( wrapAsync (userController.signUpUser)
);

router.route("/login")
.get( userController.renderloginPage)
.post(saveRedirectUrl,
     passport.authenticate("local", { failureRedirect: "/login",
    failureFlash: true,
}),
userController.loginuser
 );


//logout
router.get("/logout",userController.logoutuser);


module.exports = router;
