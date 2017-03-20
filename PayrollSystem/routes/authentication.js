var express = require('express');
var router = express.Router();
var users = require('./users.js');

router.post('/logout', function (req, res, next) {
    req.session.regenerate(function (err) { // create a new session id
        res.json({msg: 'ok'});
    });
});

router.post('/login', function (req, res, next) {
    req.session.regenerate(function (err) {
        users.findByEmail(req.body.username, function (err, user) {
            if (user && user.password == req.body.password) {
                req.session.user = user;
                delete user.password;
                res.json(user);
            } else {
                res.json({msg:'Error with username/password or status'});
            }
        });
    });
});


router.get('/user', function (req, res, next) {
    var user = req.session.user;
    if (user) {
        res.json(user);
    } else {
        res.status(403).send('Forbidden');
    }
});

module.exports = router;
