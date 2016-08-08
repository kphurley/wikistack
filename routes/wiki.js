var express = require('express');
var router = express.Router();

var models = require('../models');

var swig = require('swig');

var Page = models.Page; 
var User = models.User;

module.exports = router;

router.get('/', function(req, res, next) {
   Page.findAll()
   .then(function(pages) {
       var pageValues = pages.map(function(page) {
           return page.dataValues;
       });
       res.render('index', {pages: pageValues});
   });
});

router.post('/', function(req, res, next) {
    
    User.findOrCreate(
        {where: 
         {name: req.body.name, email: req.body.email},
        }
    )
    .then(function(userArr) {
        var user = userArr[0];
        var page = Page.build({
            title: req.body.title,
            content: req.body.content,
            status: req.body.status
        });
        
        return page.save().then(function(page) {
                return page.setAuthor(user);
        });
    })
    .then(function(page) {
        res.redirect(page.route);
    })
    
    
});

router.get('/add', function(req, res, next) {
   res.render('addpage');
});

router.get('/:page', function(req, res, next) {
   Page.findAll(
       {where: 
        {urlTitle: req.params.page}
       })
   .then(function(page) {
       res.render('wikipage', {page: page[0].dataValues});
   });
});

