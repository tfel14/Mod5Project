const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: { type: String, required: true },
});

let User = mongoose.model("User", userSchema);

mongoose.connect("mongodb://localhost:27017/courses").then(function() {
    new User({
            username: "please",
            password: "workforme",
        })
        .save()
        .then((user) => {
            console.log(user);
            res.redirect("/login");
        })
        .catch((err) => {
            console.log(err);
        });

});

// const userSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: { type: String, required: true },
// });

// module.exports = mongoose.model("User", userSchema);