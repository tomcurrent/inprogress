
var express = require('express'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    // TODO Lock Down DB via node passport...
    mongo = require('mongodb'),
    monk = require('monk'),
    db = monk('<login info here>'),// not for GIT hub
    routes = require('./routes/index'),
    users = require('./routes/users'),
    app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 8080);
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.listen(app.get('port'));
app.use(function(req,res,next){
    req.db = db;
    next();
});
app.use('/', routes);
app.use('/users', users);

module.exports = app;
