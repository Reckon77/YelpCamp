var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var Comment = require("./models/comment")
var Campground = require("./models/campground")
var passport = require("passport")
var flash = require("connect-flash")
var LocalStrategy = require("passport-local")
var User = require("./models/user")
var methodOverride = require("method-override")
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes = require("./routes/auth")
var PORT = process.env.PORT || 3000

var seedDB = require("./seeds")
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(flash())
    // seedDB()
    //Passport configuration
app.use(require("express-session")({
    secret: "My name is slim shady",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use((req, res, next) => {
    res.locals.currentUser = req.user //this middle ware will run in every single routes
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})


mongoose.set('useUnifiedTopology', true)
    // mongoose.connect("mongodb://localhost/yelpCamp", { useNewUrlParser: true })
mongoose.connect("mongodb+srv://Reckon:thisismysite@cluster0-amw8o.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true })
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.use("/campgrounds/:id/comments", commentRoutes)
app.use("/", authRoutes)
app.use("/campgrounds", campgroundRoutes) //here /campgrounds is to shorten the url in the campground routes in routes folder

// Campground.create({
//     name: "Colt White",
//     image: "https://images.unsplash.com/photo-1528892677828-8862216f3665?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
//     description: "It is a lovely place for a vacation"
// }, function(err, camp) {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(camp)
//     }
// })



app.listen(PORT, function() {
    console.log("Server Started on " + PORT)
})