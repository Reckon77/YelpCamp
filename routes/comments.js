var express = require("express")
var router = express.Router({ mergeParams: true })
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middleware = require("../middleware")
router.get("/new", middleware.isLoggedin, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err)
        } else {
            res.render("comments/new", { campground: campground })
        }
    })

})
router.post("/", middleware.isLoggedin, function(req, res) {

        Campground.findById(req.params.id, function(err, campground) {
            if (err) {
                console.log(err)
            } else {

                Comment.create(req.body.comment, function(err, comment) {
                    if (err) {
                        console.log(err)
                    } else {
                        //add username and id to comment and save comment
                        comment.author.id = req.user._id
                        comment.author.username = req.user.username
                            //save comment
                        comment.save()
                        campground.comments.push(comment)
                        campground.save()
                        console.log(comment)
                        req.flash("success", "Successfully added comment")
                        res.redirect(`/campgrounds/${campground._id}`)

                    }
                })
            }
        })
    })
    //Edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("back")
            } else {
                res.render("comments/edit", { campground_id: req.params.id, comment: foundComment })
            }
        })

    })
    //Update route
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
        Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
            if (err) {
                res.redirect("back")
            } else {
                res.redirect("/campgrounds/" + req.params.id)
            }
        })
    })
    //Delete route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("/campgrounds/" + req.params.id)
        } else {
            req.flash("success", "Comment deleted")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

module.exports = router