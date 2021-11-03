let jwt = require('jsonwebtoken');
const { body } = require('express-validator');

const jwtConfig = require('../config/config').jwt;
// TODO: Require Controllers...

const createPOST = require("../controllers/createPOST");
const detailsGET = require("../controllers/detailsGET");
const userGET = require("../controllers/userGET");
const login = require("../controllers/login");
const register = require("../controllers/register");
const edit = require("../controllers/edit");
const deleteCourse = require("../controllers/deleteCourse");



module.exports = (app) => {
    // TODO...
    app.use((req, res, next) => {
        if (req.cookies.user) {
            let decodedJWT = jwt.verify(req.cookies.user, jwtConfig.secret);
            res.user = {
                id: decodedJWT.id,
                username: decodedJWT.username,
            };
        }
        if (req.cookies.status) {
            let status = req.cookies.status;
            res.clearCookie("status");
            console.log(status);
            res.show = status.type;
            res.message = status.message;
        }
        if (res.show == undefined) {
            res.show = "none";
        }
        next();
    });

    app.get("/", userGET);
    app.get("/user", userGET);
    app.get("/create/course", function(req, res) {
        if (res.user) {
            let context = {};
            context.type = "none";
            context.loggedIn = true;
            res.render("create-course", context);
        } else {
            res.cookie("status", {
                type: "success",
                message: "User created!"
            });
            res.redirect("create-course");
        }
    });
    app.post("/create/course", createPOST);
    app.get("/edit/course/:id", edit.get);
    app.post("/edit/course/:id", edit.post);

    app.get("/delete/course/:id", deleteCourse.get);
    app.post("/delete/course/:id", deleteCourse.post);
    app.get("/register", function(req, res) {
        let user = res.user;
        let context = {};
        context.type = res.show;
        if (res.show != "none") {
            context.message = res.message;
        }
        if (!user) {
            res.render("register", context);
        } else {
            res.cookie("status", {
                type: "success",
                message: "User created!"
            });
            res.redirect("/user");
        }
    });
    app.post("/register", body('username').trim().isLength({ min: 5 }).isAlphanumeric(), body("password").trim().isLength({ min: 8 }).isAlphanumeric(), register);

    app.get("/login", function(req, res) {
        let user = res.user;
        let context = {};
        context.type = res.show;
        if (res.show != "none") {
            context.message = res.message;
        }
        if (!user) {
            res.render("login", context);
        } else {
            res.cookie("status", {
                type: "success",
                message: "User created!"
            });
            res.redirect("/login");
        }
    });
    app.post("/login", login);

    app.get("/logout", (req, res) => {
        res.clearCookie("user");
        res.cookie("status", {
            type: "success",
            message: "Log out successful"
        });
        res.redirect("/");
    });
    app.get("/details/:id", detailsGET);
    app.get("*", function(req, res) {
        let context = {};
        res.show = "none";
        if (res.user) {

            context.loggedIn = true;
        }

        res.render("404", context);
    });
};