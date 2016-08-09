var express = require('express');
var app = express();

var swig = require('swig');
var morgan = require('morgan');

var models = require('./models');

var Page = models.Page; 
var User = models.User;

var wikiRoutes = require('./routes/wiki');
var userRoutes = require('./routes/users');
var searchRoutes = require('./routes/search');

var bodyParser = require('body-parser');
// create application/json parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

User.sync()
 .then(function() {
   return Page.sync();  
})
 .then(function(){
    app.listen(3000)
})
 .catch(function(e) {
    throw e
});

app.use(morgan('dev'));

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
swig.setDefaults({cache: false});

app.use(express.static('./public'));

app.use(jsonParser);

app.use(urlencodedParser);

app.use('/wiki', wikiRoutes);
app.use('/users', userRoutes);
app.use('/search', searchRoutes);




