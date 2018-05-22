var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Campsite = require("../models/campsites"),
    Comment = require("../models/comment");


router.get("/new", middleware.isLogedIn, function (req, res) {
    Campsite.findById(req.params.id, function (err, campsite) {
        if (err) {
            req.flash("flashError", "Ups there was an error performing the previous action");
            return res.redirect("/campsites");
        } 
        res.render("comments/new", { campsite: campsite });
    });
});

router.post("/", middleware.isLogedIn, function (req, res) {

    Campsite.findById(req.params.id, function (err, campsite) {

        if (err || !campsite) {
            req.flash("flashError", "Ups there was an error performing the previous action");
            return res.redirect("/campsites");
        }
        var commentData = {
            text: req.body.comment.text,
            author: { id: req.user._id, username: req.user.username }
        };

        Comment.create(commentData, function (err, comment) {
            if (err || !comment) {
                req.flash("flashError", "Ups there was an error performing the previous action");
                return res.redirect("/campsites");
            }
            campsite.comments.push(comment);
            campsite.save();
            req.flash("flashSuccess", "Comment was created");
            res.redirect("/campsites/" + req.params.id);            
        });
    });
});



router.put("/:comments_id", middleware.isLogedIn, middleware.isAuthorizedComment, function (req, res) {

    Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, function (err, comment) {
        if (err || !comment) {
            req.flash("flashError", "Ups there was an error performing the previous action");
            return res.redirect("/campsites");
        } 
        req.flash("flashSuccess", "Comment was updated");
        res.redirect("/campsites/" + req.params.id);
    });
});

router.get("/:comments_id/edit", middleware.isLogedIn, middleware.isAuthorizedComment, function (req, res) {
    Comment.findById(req.params.comments_id, function (err, comment) {
        if (err || !comment) {
            req.flash("flashError", "Ups there was an error performing the previous action");
            return res.redirect("back");
        }
        res.render("comments/edit", { campsite_id: req.params.id, comment: comment });        
    });
});

router.delete("/:comments_id", middleware.isLogedIn, middleware.isAuthorizedComment, function (req, res) {

    Comment.findByIdAndRemove(req.params.comments_id, function (err, comment) {
        if (err || !comment) {
            req.flash("flashError", "Ups there was an error performing the previous action");
            return res.redirect("back");
        } 
        req.flash("flashSuccess", "Comment was removed");
        res.redirect("/campsites/" + req.params.id);     
    });
});

module.exports = router;