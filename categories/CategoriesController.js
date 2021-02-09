const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");


//Router that will list all of "category"
router.get("/admin/categories",adminAuth, (req, res) => {
    Category.findAll().then((categories) => {
        res.render("admin/categories/index", {
            categories: categories
        })
    })
    })
//Router that will render the view "add category"
router.get("/admin/categories/new",adminAuth, (req, res) => {
    res.render("admin/categories/new");
})

//Router that will get datas from "form" and save in database
router.post("/categories/save",adminAuth, (req, res) => {
    const title = req.body.title;
    if(title != undefined) {
        Category.create({
            title: title,
            slug: slugify(title).toLowerCase()
        }).then(() => {
            res.redirect('/')
        })
    }else {
        res.redirect("/admin/categories/new")
    }
})

router.post("/categories/delete",adminAuth, (req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){

            Category.destroy({
                where: {
                    id:id
                }
            }).then(() => {
                res.redirect("/admin/categories")
            })
        } else{
            res.redirect("/");
        }
    } else {
        res.redirect("/")
    }
})

router.get("/admin/categories/edit/:id",adminAuth, (req, res) => {
    var id = req.params.id;
    Category.findByPk(id).then(category => {

        if(category != undefined){
            res.render("admin/categories/edit", {category: category});
        } else {
            res.redirect("/admin/categories")
        }
    }).catch((err) => {
        res.redirect("/admin/categories")

    })
})

router.post("/categories/update",adminAuth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var slug = req.body.slug;

    Category.update({title: title, slug: slug}, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/categories")
    })
})


module.exports = router;