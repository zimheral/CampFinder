var express = require("express"),
    bodyParser = require("body-parser"),
    app = express(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
    methodOverride = require('method-override'),
    Campsite = require("./models/campsites"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB   = require("./data.js"),
    campsitesRoute = require("./routes/campsitesRoute"),
    commentsRoute = require("./routes/commentsRoute"),
    indexRoute = require("./routes/indexRoute");
       
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname+"/public"));
app.use(require("express-session")({ secret: 'bloggrs secret pass', resave: false, saveUninitialized: true }));
app.use(flash()); 
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
    res.locals.loggedUser = req.user;
    res.locals.flashError = req.flash("flashError");
    res.locals.flashSuccess = req.flash("flashSuccess");   
    next();
});

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set ("view engine", "ejs");
mongoose.connect('mongodb://localhost/campfinder');
seedDB();

app.use("/",indexRoute);
app.use("/campsites", campsitesRoute);
app.use("/campsites/:id/comments", commentsRoute);

let port = 4000;
app.listen(port,function(){
    console.log("Server started. Running on port: "+port);
});

