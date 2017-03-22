var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var index = require('./routes/index');
var authentication = require('./routes/authentication');

var app = express();
app.set("view engine", "ejs");
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
        secret:'star',
        resave : true,
        saveUninitialized : true,

    }
));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/payroll', index.showLogin);
app.get('/payroll/user', index.showUser);
app.get('/payroll/manage', index.showManage);
app.get('/payroll/search/:eid', index.search);
app.get('/payroll/paystub', index.paystub);
app.use('/payroll/api',authentication);
app.get('/payroll/hire', index.showHire);
app.get('/payroll/fire/:eid', index.fire);
app.get('/payroll/info/:eid', index.info);
app.post('/payroll/hire', index.hire);


app.use(index.showError);



module.exports = app;
