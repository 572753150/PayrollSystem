var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');

var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var app = express();
var authentication = require('./routes/authentication');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(
    {
        secret:'A SECRET KEY. SHOULD BE UNIQE TO THE APP. DONT EVER SHOW IT TO ANYONE',
        resave : true,
        saveUninitialized : true
    }
));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
    res.sendFile( 'index.html', { root : __dirname + "/public" } );
});

app.use( '/', authentication );
app.use('/api', routes);

connect()
    .on( 'error', console.log )
    .on( 'disconneted', connect );

function connect() {
    var options = { server : { socketOptions : { keepAlive : 1 } } };
    return mongoose.connect( 'mongodb://localhost:27017/mongoose_salarys', options ).connection;
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send( { msg : err.message } );
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send( { msg: err.message } );
} );


module.exports = app;
