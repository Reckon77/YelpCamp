//all middlewares
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middlewareObj = {}
middlewareObj.checkOwner = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                req.flash("error", "Campground not found")
                res.redirect("back")
            } else {
                //does he own campground
                if (foundCampground.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "Please Login!")
        res.redirect("back") //It takes the user to the previous page
    }
}
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {

                res.redirect("back")
            } else {
                //does he own comment
                if (foundComment.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "Please Login!")
        res.redirect("back") //It takes the user to the previous page
    }
}
middlewareObj.isLoggedin = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash("error", "Please Login first!")
    res.redirect("/login")
}

module.exports = middlewareObj