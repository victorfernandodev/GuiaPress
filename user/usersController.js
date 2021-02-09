const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require('bcryptjs');


router.get("/admin/users", (req, res) => {
    User.findAll().then((users) => {
        res.render("admin/users/index", {users: users});
    }).catch((err) => {
        res.redirect("/");
    })
})

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
})

router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var senha = req.body.password;

    User.findOne({
        where:{
            email:email
        }
    }).then((user) => {
        if(user == undefined){
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(senha, salt);

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/admin/users")
            }).catch((error) => {
                res.redirect("/admin/users")
            })
        }else {
            res.redirect("/admin/users/create");
        }
    })
})

router.get("/login", (req, res) => {
    res.render("admin/users/login")
})

router.post("/authenticate", (req, res) => {
    var email = req.body.email;
    var senha = req.body.password;

    User.findOne({where:{
        email:email
    }}).then((user) => {
        if(user != undefined) {
            var correct = bcrypt.compareSync(senha, user.password);
            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles/index");
            }
        } else {
            res.redirect("/login")
        }
    })
})

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
})
User.sync({force: false});

module.exports= router;