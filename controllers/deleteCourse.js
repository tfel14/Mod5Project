const Course = require("../models/Course");


module.exports = {
    get: (req, res) => {
        id = req.params.id;
        let context = {};
        let user = res.user;
        context.type = res.type;
        if (res.type != "none") {
            context.message = res.message;
        }
        if (user) {

            context.loggedIn = true;
            Course.findById(id).then(course => {
                console.log(course);
                if (user.id == course.creator) {
                    context.isCurrentUser = true;
                }

                context.id = course._id;
                context.name = course.name;
                context.description = course.description;
                context.imgURL = course.imgURL;

            });

        } else {
            context.type = "error";
            context.message = "Course not made by this User, cannot delete a cube made by another User";
            res.redirect(`/details/${id}`, context);
        }
    },
    post: (req, res) => {

        let id;
        id = req.params.id;

        Course.findByIdAndRemove(id)

        .then((course) => {
            console.log(course);

            res.redirect("/user");
        });
    },
};