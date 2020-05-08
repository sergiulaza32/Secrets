require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.route("/login")
    .get(function(req, res) {
        res.render("login");
    })
    .post(function(req, res) {
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({ email: username, password: password }, function(err, foundUser) {

            if (!err) {
                if (foundUser) {
                    res.render("secrets");
                } else {
                    res.render("You are not registered!");
                }
            } else {
                console.log(err);
            }
        });
    });



app.route("/register")
    .get(function(req, res) {
        res.render("register");
    })
    .post(function(req, res) {

        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });

        newUser.save(function(err) {
            if (!err) {
                res.render("secrets");
            } else {
                console.log(err);
            }
        });

    });









app.listen(3000, function() {
    console.log("Server is running on port 3000");
});