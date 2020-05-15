var express = require("express")
var router = express.Router()
var passport = require("passport")
var User = require("../models/user")
router.get("/", function(req, res) {
    res.render("landing")
})

//=================================
//COMMENTS ROUTES
//=================================

//Auth routes
//show register form
router.get("/register", (req, res) => {
    var msg
    res.render("register", { msg: msg })
})
router.post("/register", (req, res) => {
        var newUser = new User({ username: req.body.username })
        User.register(newUser, req.body.password, (err, user) => {
            if (err) {

                return res.render("register", { "error": err.message });
            }
            passport.authenticate("local")(req, res, () => {
                req.flash("success", "Welcome to YelpCamp " + user.username)
                res.redirect("/campgrounds")
            })

        })
    })
    //login
router.get("/login", (req, res) => {
    res.render("login")
})
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) => {})
    //Logout
router.get("/logout", (req, res) => {
    req.logout()
    req.flash("success", "Logged you out")
    res.redirect("/campgrounds")
})


module.exports = router