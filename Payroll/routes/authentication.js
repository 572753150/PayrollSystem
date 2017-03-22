var express = require('express');
var router = express.Router();
var users = require('./../models/Employee');
router.get('/logout', function (req, res, next) {
    req.session.regenerate(function (err) {
        res.render('login');
    });
});

router.post('/login', function (req, res, next) {
    req.session.regenerate(function (err) {
        users.findByEid(req.body.eid, function (err, user) {
            if (user && user.password == req.body.password) {
                req.session.user = user;
                delete user.password;
                res.render('user',{employee:user});
            } else {
                res.render('login');
            }
        });
    });
});

router.get('/user', function (req, res, next) {
    var user = req.session.user;
    if (user ) {
        res.render('user',{employee:user});
    } else {
        res.render('login');
    }
});

module.exports = router;
