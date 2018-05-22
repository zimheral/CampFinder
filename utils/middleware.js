var Campsite = require("../models/campsites"),
    Comment = require("../models/comment"),
    middleware = {};

middleware.isLogedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("flashError", "Please login first!!!");
    res.redirect("/login?from=" + req.originalUrl);
}

middleware.isAuthorized = function (req, res, next) {
    Campsite.findById(req.params.id, function (err, campsite) {
        if (err || !campsite) {
            req.flash("flashError", "Ups there was performing the previous action");
            res.redirect("back");
        } else {
            if (campsite.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("flashError", "Sorry you are not authorized to view that page");
                res.redirect("back");
            }
        };
    });
}

middleware.isAuthorizedComment = function (req, res, next) {

    Campsite.findById(req.params.id, function (err, campsite) {
        if (err || !campsite) {
            req.flash("flashError", "Ups there was performing the previous action");
            return res.redirect("back");
        }

        Comment.findById(req.params.comments_id, function (err, comment) {
            if (err || !comment) {
                req.flash("flashError", "Ups there was performing the previous action");
                res.redirect("back");
            } else {
                if (comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("flashError", "Sorry you are not authorized to view that page");
                    res.redirect("back");
                }
            }
        });

    });
}

module.exports = middleware;