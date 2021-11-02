const Course = require("../models/Course");
const { validationResult } = require('express-validator');

module.exports = function(req, res) {
    console.log("Getting all COURSES!!");
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

    Course.find({}).then(courses => {
        let courseArray = courses.map(course => {
            let subCourse = {
                id: course._id,
                name: course.name,
                description: course.description,
                imgURL: course.imgURL
            };
            return subCourse;
        });
        console.log(courses);
        context.courses = courseArray;

        res.render("user-home", context);
    });

};




// fs.readFile("./config/database.json", "utf8", (err, data) => {
//     if (err) throw err;
//     //console.log("Uploading Cube data");
//     let courses = JSON.parse(data);

//     console.log(courses);
//     let context = {
//         courses
//     };

//     res.render("user-home", context);

// });