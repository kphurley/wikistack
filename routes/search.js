var express = require('express');
var router = express.Router();

var models = require('../models');

var swig = require('swig');

var Page = models.Page; 
var User = models.User;

module.exports = router;

//search routing....
router.get('/', function(req, res, next) {
    if(Object.keys(req.query).length === 0)
    {
        res.render('search');
    }
    else{
        
        Page.findByTags(req.query.input_tags)
        .then(function(pages) {
            res.render('search', {pages: pages})
        });
    }
})