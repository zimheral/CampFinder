var express     = require("express"),
    router      = express.Router(),
    Campsite    = require("../models/campsites")
    middleware  = require("../utils/middleware");


router.get("/", function (req, res) {

    Campsite.find(function (err, campsites) {
        if (err || !campsites) {
            req.flash("flashError", "Ups there was an error performing the previous action");
            return res.redirect("back");
        }
        return res.render("campsites/index", { campsites: campsites });
    });
});

router.post("/", middleware.isLogedIn, function (req, res) {

    var authorData = {
        id: req.user._id,
        username: req.user.username
    };

    req.body.campsite.author = authorData;

    Campsite.create(req.body.campsite, function (err, campsite) {
        if (err || !campsite) {
            req.flash("flashError", "Ups there was an error performing the previous action");
            return res.redirect("back");
        }
        req.flash("flashSuccess", "New campsite added");
        res.redirect("/campsites");
    });
});

router.get("/new", middleware.isLogedIn, function (req, res) {
    res.render("campsites/new");
});

router.get("/:id", function (req, res) {

    Campsite.findById(req.params.id).populate("comments").exec(function (err, campsite) {
        if (err || !campsite) {
            req.flash("flashError", "Ups there was an error performing the previous action");
            return res.redirect("back");
        }
        res.render("campsites/show", { campsite: campsite });
    });
});

router.put("/:id", middleware.isLogedIn, middleware.isAuthorized, function (req, res) {

    Campsite.findByIdAndUpdate(req.params.id, req.body.campsite, function (err, campsite) {
        if (err || !campsite) {
            req.flash("flashError", "Ups there was an error performing the previous action");
            return res.redirect("/campsites");
        } 
        req.flash("flashSuccess", "Campsite succesfully updated");
        res.redirect("/campsites/" + req.params.id);
    });
});

router.get("/:id/edit", middleware.isLogedIn, middleware.isAuthorized, function (req, res) {
    Campsite.findById(req.params.id, function (err, campsite) {
        if (err || !campsite) {
            req.flash("flashError", "Ups there was an error performing the previous action");
            return res.redirect("back");
        }
        res.render("campsites/edit", { campsite: campsite });
    });
});

router.delete("/:id", middleware.isLogedIn, middleware.isAuthorized, function (req, res) {

    Campsite.findByIdAndRemove(req.params.id, function (err, campsite) {
        if (err || !campsite) {
            req.flash("flashError", "Ups there was an error performing the previous action");
            return res.redirect("back");
        } 
        res.redirect("/campsites");        
    });
});

module.exports = router;
