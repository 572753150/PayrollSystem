var express = require('express');
var router = express.Router();
var users = require('./account.js');

router.post('/logout', function (req, res, next) {
    req.session.regenerate(function (err) { // create a new session id
        res.json({msg: 'ok'});
    });
});

router.post('/login', function (req, res, next) {
    req.session.regenerate(function (err) {
        users.findByEmail(req.body.username, function (err, account) {
            if (account && account.password == req.body.password) {
                req.session.user = account;
                delete account.password;
                res.json(account);
            } else {
                res.json({msg:'Error with username/password or status'});
            }
        });
    });
});


router.get('/user', function (req, res, next) {
    var account = req.session.user;
    if (account) {
        res.json(account);
    } else {
        res.status(403).send('Forbidden');
    }
});

module.exports = router;
