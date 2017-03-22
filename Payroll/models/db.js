var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/payroll');

var db = mongoose.connection;
db.once('open', function (callback) {
    console.log("open");
});

module.exports = db;