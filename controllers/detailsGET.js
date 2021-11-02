const Course = require("../models/Course");

module.exports = function(req, res) {
    let user = res.user;
    //console.log(user);
    let context = {};
    if (user) {
        context.loggedIn = true;
    }

    context.type = res.show;
    if (res.show != "none") {
        context.message = res.message;
    }
    //details for the cube with :id
    //console.log(req.params);
    let id;

    id = req.params.id;
    console.log(id);
    //get the data from the db
    Course.findById(id).then(course => {
        console.log(course);
        if (user.id == course.creator) {
            context.isCurrentUser = true;
        }

        context.id = course._id;
        context.name = course.name;
        context.description = course.description;
        context.imgURL = course.imgURL;
        res.render("details", context);

    });
};