const Course = require("../models/Course");


module.exports = function(req, res) {
    console.log("Creating a Course!!");


    console.log(req.body);
    let context = {};
    let fields = req.body;

    if (fields.name.length < 5 || /[^a-zA-Z0-9 ]/g.test(fields.name)) {
        context.type = "error";
        context.message = "Please enter a valid name for the Course.";
        context.name = fields.name;
        context.description = fields.description;
        context.imgURL = fields.imgURL;
        return res.render("create-course", context);
    }
    if (fields.description.length < 20 || /[^a-zA-Z0-9 \.]/g.test(fields.description)) {
        context.type = "error";
        context.message = "Please enter a valid description for the Course.";
        context.name = fields.name;
        context.description = fields.description;
        context.imgURL = fields.imgURL;
        return res.render("create-course", context);
    }
    if (!(fields.imgURL.startsWith("http://") || fields.imgURL.startsWith("https://"))) {
        context.type = "error";
        context.message = "Please enter a valid image url for the Course.";
        context.name = fields.name;
        context.description = fields.description;
        context.imgURL = fields.imgURL;
        return res.render("create-course", context);
    }

    new Course({
            name: fields.name,
            description: fields.description,
            imgURL: fields.imgURL,
            creator: res.user.id
        })
        .save()
        .then((course) => {
            console.log(course);
            res.redirect("/user");
        })
        .catch((err) => {
            console.log(err);
        });

};



// fs.readFile("./config/database.json", "utf8", (err, data) => {
//     if (err) throw err;
//     //console.log("Uploading Cube data");
//     let courses = JSON.parse(data);
//     courses.push(newCourse);
//     let json = JSON.stringify(courses);
//     console.log(json);

//     fs.writeFile("./config/database.json", json, (err) => {
//         if (err) throw err;
//         console.log("Data uploaded successfully");

//         // redirect to the "/" route
//         // otherwise send error to the front end
//         res.redirect("/user");
//     });
// });