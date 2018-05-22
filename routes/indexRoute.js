var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

router.get("/", function (req, res) {
    res.render("home");
});

router.get("/register", function (req, res) {
    res.render("register");
});

router.post("/register", function (req, res) {

    var userName = new User({ username: req.body.username });

    User.register(userName, req.body.password, function (err, user) {
        if (err || !user) {
            req.flash("flashError", "Ups there was an error performing the previous action: " + err.message);
            return res.redirect("register");
        }

        passport.authenticate('local')(req, res, function () {
            req.flash("flashSuccess", "User successfully registered");
            res.redirect('/campsites');
        });
    });
});

router.get("/login", function (req, res) {
    res.render("login", { from: req.query.from });
});

router.post('/login', function (req, res, next) {

    passport.authenticate('local', function (err, user, info) {

        if (err) {
            req.flash("flashError", "Ups there was an error performing the previous action: " + err.message);
            return res.redirect('/login');
        }else if(!user){
            req.flash("flashError", "Incorrect user/password combination. Please sign up first if you are not registered");
            return res.redirect('/login');
        }

        req.logIn(user, function (err) {
            if (err) { return next(err); }

            req.flash("flashSuccess", "Welcome back "+user.username);
            req.body.fromURL ? res.redirect(req.body.fromURL) : res.redirect("/campsites");
        });
    })(req, res, next);
});

router.get("/logout", function (req, res) {
    req.logOut();
    req.flash("flashSuccess", "You logged out");
    res.redirect("/campsites");
});

module.exports = router;