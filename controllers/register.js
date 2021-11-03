let bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const saltConfig = require("../config/config").saltRounds;

const User = require("../models/User");


module.exports = (req, res) => {
    let username = req.body.username;
    let pass = req.body.password;
    let rePass = req.body.repeatPassword;
    let context = {};
    context.username = username;
    context.pass = pass;
    context.rePass = rePass;
    //TODO make sure the user have a unique username
    let { errors } = validationResult(req);

    if (errors.length > 1) {
        if (errors[0].param == "username") {
            context.type = "error";
            context.message =
                "Please make sure your username is at least 5 characters long, and only contains letters and numbers.";
        } else {
            context.type = "error";
            context.message =
                "Please make sure your password is at least 8 characters long, and only contains letters and numbers.";
        }
        console.log(errors);
        return res.render("register", context);
    }
    User.find({ username: username }).then((users) => {
        if (users.length > 0) {
            context.type = "warning";
            context.message = "Sorry Username is already taken.";
            return res.render("register", context);
        }
        if (pass.length < 8 || /\W/g.test(pass)) {
            context.type = "error";
            context.message =
                "Please make sure your password is at least 8 characters long, and only contains letters and numbers.";
            return res.render("register", context);
        }

        if (pass == rePass) {
            bcrypt.genSalt(saltConfig, (err, salt) => {
                bcrypt.hash(pass, salt, (err, hash) => {
                    console.log(hash);
                    new User({
                            username,
                            password: hash,
                        })
                        .save()
                        .then((user) => {
                            res.status(201);
                            console.log(`User was created successfully!`);
                            console.log(user);
                            res.cookie("status", {
                                type: "success",
                                message: "User created!"
                            });

                            res.redirect("/login");
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                });
            });
        } else {
            context.type = "error";
            context.message =
                "Please make sure your passwords match for both boxes";
            return res.render("register", context);
        }
    });
};