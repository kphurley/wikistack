var express = require('express');
var router = express.Router();

var models = require('../models');

var swig = require('swig');

var Page = models.Page; 
var User = models.User;

module.exports = router;

//list authors
router.get('/', function(req, res, next) {
   User.findAll()
   .then(function(users) {
       var userValues = users.map(function(user) {
           return user.dataValues;
       });
       res.render('userPage', {users: userValues});
   });
});

router.get('/:id', function(req, res, next) {
   Page.findAll(
       {where: 
        {authorId: +req.params.id}
       })
   .then(function(pages) {
       User.findAll(
       {where:
         {id: +req.params.id}
       })
       .then(function(user) {
           var pageValues = pages.map(function(page) {
                return page.dataValues;
           });
           res.render('user', {pages: pages, user: user[0].dataValues});
       });
           
   });
});