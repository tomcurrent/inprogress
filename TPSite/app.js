
var express = require('express'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongo = require('mongodb'),
    monk = require('monk'),
    db = monk(/* not for gitHub */),
    routes = require('./routes/index'),
    app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 8080);
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express['static'].apply(null, [__dirname + '/public']));
app.listen(app.get('port'));
app.use(function(req,res,next){
    req.db = db;
    next();
});
app.use('/', routes);
module.exports = app;
