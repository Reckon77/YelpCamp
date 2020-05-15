var express = require("express")
var router = express.Router()
var Campground = require("../models/campground")
var middleware = require("../middleware")
router.get("/", function(req, res) {
    console.log(req.user);
    Campground.find({}, function(err, allCamps) {
        if (err) {
            console.log(err)
        } else {
            res.render("campgrounds/index", { campgrounds: allCamps, currentUser: req.user })
        }
    })


})
router.post("/", middleware.isLoggedin, function(req, res) {
    var newName = req.body.name
    var newImage = req.body.image
    var newDesc = req.body.desc
    var price = req.body.price
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: newName, image: newImage, description: newDesc, author: author, price: price }

    Campground.create(newCampground, function(err, newcamp) {
        if (err) {
            console.log(err)
        } else {
            console.log(newcamp);
            res.redirect("/campgrounds")
        }
    })
})
router.get("/new", middleware.isLoggedin, function(req, res) {
    res.render("campgrounds/new")
})
router.get("/:id", function(req, res) {
        Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
            if (err) {
                console.log(err)
            } else {
                console.log(foundCampground)
                res.render("campgrounds/show", { campground: foundCampground })

            }
        })

    })
    //Edit campground
router.get("/:id/edit", middleware.checkOwner, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", { campground: foundCampground })
    })
})

//Update campground
router.put("/:id", middleware.checkOwner, (req, res) => {
        Campground.findByIdAndUpdate(req.params.id, req.body.camp, (err, updatedCamp) => {
            if (err) {
                res.redirect("/campgrounds")
            } else {
                res.redirect("/campgrounds/" + req.params.id)
            }
        })
    })
    //Delete campground
router.delete("/:id", middleware.checkOwner, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds")
        }
    })
})

module.exports = router