var express = require('express');
var router = express.Router();
var users = require('./account.js');
var bcrypt = require('bcrypt-nodejs');

router.post('/logout', function (req, res, next) {
    req.session.regenerate(function (err) { // create a new session id
        res.json({msg: 'ok'});
    });
});

router.post('/login', function (req, res, next) {
    req.session.regenerate(function (err) {
        users.findByEmail(req.body.username, function (err, account) {
            if (account && bcrypt.compareSync(req.body.password, account.password)) {
                req.session.user = account;
                account.password = "";
                if(account.status == "false"){
                    res.json({msg:"have no such user!!!"});
                }else{
                    res.json(account);
                }

            } else {
                res.json(400,{msg:'Error with username/password or status'});
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
