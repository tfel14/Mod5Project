let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");

const saltConfig = require("../config/config").saltRounds;
const jwtConfig = require("../config/config").jwt;

const User = require("../models/User");

module.exports = (req, res) => {
    let username = req.body.username;
    let pass = req.body.password;
    let context = {};
    User.findOne({ username })
        .then((user) => {
            if (user !== null) {
                bcrypt.compare(pass, user.password, (err, result) => {
                    if (result) {
                        res.status(200);
                        let userToken = {
                            id: user._id,
                            username: user.username,
                        };
                        const token = jwt.sign(
                            userToken,
                            jwtConfig.secret,
                            jwtConfig.options
                        );

                        console.log(token);
                        res.cookie("user", token);
                        res.cookie("status", {
                            type: "success",
                            message: "User Logged in!"
                        });
                        res.redirect("/");
                    } else {
                        res.status(406);
                        context.type = "warning"
                        context.message = "Bad password"
                        context.username = username;
                        context.pass = pass;
                        res.render("login", context)
                    }
                });
            } else {
                res.status(406);
                console.log("bad Username");
                context.type = "warning";
                context.message = "Bad username";
                context.username = username;
                context.pass = pass;
                res.render("login", context)
            }
        })
        .catch((err) => {
            console.log(err);
        });
};