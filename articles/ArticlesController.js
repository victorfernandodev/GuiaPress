const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");


router.get("/admin/articles/index",adminAuth, (req, res) => {
    Article.findAll(
        {include: [{model: Category}]}
    ).then((articles) => {
        res.render("admin/articles/index", {articles: articles})
    })
})

router.get("/admin/articles/new", adminAuth, (req, res) => {
    Category.findAll().then((categories) => {
        res.render("admin/articles/new", {categories: categories});
    })
})

router.post("/articles/save", adminAuth, (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var categoryId = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title).toLowerCase(),
        body: body,
        categoryId: categoryId

    }).then(() => {
        res.redirect("/admin/articles/index");
    }).catch((err) => {
        alert(err);
    })
})

router.post("/articles/delete", adminAuth, (req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){

            Article.destroy({
                where: {
                    id:id
                }
            }).then(() => {
                res.redirect("/admin/articles/index")
            })
        } else{
            res.redirect("/admin/articles/index");
        }
    } else {
        res.redirect("/admin/articles/index")
    }
})
//Rota para mostrar página de edição.
router.get("/admin/articles/edit/:id",adminAuth, (req, res) => {
    var id = req.params.id

    Article.findOne({where:{
        id:id
    }}).then((article) => {
        Category.findAll().then((categories) => {
            res.render("admin/articles/edit", {article:article, categories:categories})
        })
    }).catch((err) => {
        res.redirect("/admin/articles/index")
    })
})

router.post("/articles/edit/save",adminAuth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.update({title:title, body:body, categoryId: category, slug: slugify(title)}, {
        where:{
            id:id
        }
    }).then(() => {
        res.redirect("/admin/articles/index");
    }).catch((err) => [
        res.redirect("/")
    ])

})

router.get("/articles/page/:num", (req, res) =>{
    var page = req.params.num;
    var offset = 0;

    if(isNaN(page) || page == 1 ){
        offset = 0;
    } else {
        offset = (parseInt(page) -1) * 4;
    }
    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [
            ['id', 'DESC']
        ]
    }).then((articles) => {

        var next;
        if(offset + 4 >= articles.count){
            next = false;
        } else {
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then((categories) => {
            res.render("admin/articles/page", {result: result, categories: categories})
        })
    })

})

router.get("/admin/articles/index",adminAuth, (req, res) => {
    Article.findAll().then((articles) => {
        res.render("admin/articles/index", {articles: articles})
    })
})
module.exports = router;