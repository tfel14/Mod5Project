const { validationResult } = require("express-validator");

const Course = require("../models/Course");


module.exports = {
    get: (req, res) => {
        id = req.params.id;
        let context = {};
        let user = res.user;
        context.type = res.show;
        if (res.show != "none") {
            context.message = res.message;
        }
        if (user) {
            context.loggedIn = true;
            Course.findById(id).then((course) => {
                //console.log(cube);
                console.log(user);
                console.log(course);
                if (user.id == course.creator) {
                    context.isCurrentUser = true;
                } else {
                    res.cookie("status", {
                        type: "error",
                        message: "Course not made by this User, cannot edit a course made by another User",
                    });
                    return res.redirect(`/details/${id}`);
                }

                context.id = course._id;
                context.name = course.name;
                context.description = course.description;
                context.imgURL = course.imgURL;

                res.render("edit", context);
            });
        } else {
            res.cookie("status", {
                type: "error",
                message: "User needs to be logged in to view this page",
            });
            res.redirect(`/details/${id}`);
        }
    },
    post: (req, res) => {
        let id;
        id = req.params.id;
        let updates = req.body;
        console.log(updates);
        updates.name = updates.name.trim();
        updates.description = updates.description.trim();
        updates.imgURL = updates.imgURL.trim();

        if (!(updates.imgURL.startsWith("http://") || updates.imgURL.startsWith("https://"))) {
            res.cookie("status", {
                type: "error",
                message: "please select a valid image URL",
            });
            return res.redirect(`/edit/course/${id}`);
        }

        if (updates.description.length < 20 || /[^a-zA-Z 0-9\.]/g.test(updates.description)) {
            res.cookie("status", {
                type: "error",
                message: "please enter a valid description (no special characters)",
            });
            return res.redirect(`/edit/course/${id}`);
        }
        if (updates.name.length < 5 || /[^a-zA-Z0-9 ]/g.test(updates.name)) {
            res.cookie("status", {
                type: "error",
                message: "please enter a valid course name (no special characters)",
            });
            return res.redirect(`/edit/course/${id}`);
        }

        Course.findById(id).then((course) => {

            course.name = updates.name;
            course.description = updates.description;
            course.imgURL = updates.imgURL;
            course.save()
                .then((course) => {
                    console.log("update successful");
                    res.cookie("status", {
                        type: "success",
                        message: "Update successful",
                    });
                    res.redirect(`/details/${id}`);
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    },
};