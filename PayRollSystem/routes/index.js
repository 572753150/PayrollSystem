var express = require('express');
var router = express.Router();
var accounts = require("./account")
var salarys = require('./salary');


router.get('/accounts/init', function (req, res, next) { //初始化数据库
    accounts.init((err, result) => res.json(result));
});

router.all('/accounts/:aid/*', function (req, res, next) { // 验证用户的合法性
    accounts.findById(req.session.user.id, function (error, pathAccount) {
        var authenticatedAccount = req.session.user;
        if (authenticatedAccount && pathAccount && authenticatedAccount.id == pathAccount.id) {
            next();
        } else {
            res.redirect('/');
        }
    });
});

router.post('/accounts/:aid/', function (req, res, next) { // 添加一个用户
    var authenticatedAccount = req.session.user;
    if (authenticatedAccount.priority > 1) {
        var newaccount = req.body;
        accounts.save(newaccount, function (err, result) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.json(result);
            }
        });
    }
});

router.get('/accounts', function (req, res, next) {   // 列出可管理所有的account数目
    var account = req.session.user;
    accounts.findAll(account, function (error, result) {
        if (error) {
            res.status(500).json(error);
        } else {
            res.json(result);
        }
    });
});


router.put('/accounts/:aid/', function (req, res, next) { // 修改指定的account
    salarys.update(req.params.aid, req.body, function (err, thing) {
        if (err) {
            res.status(403).json({msg: err});
        } else {
            res.json(thing);
        }
    });
});

router.get('/accounts/:aid/salarys', function (req, res, next) {
    // 得到所以的salary
    console.log("ssart",req.params.aid);
    salarys.findByOwner(req.params.aid, function (err, result) {
        if (err) {
            res.json({msg: err});
        } else {
            res.json(result);
        }
    });
});


router.get('/accounts/:email', function (req, res, next) {
        var email = req.params.email;
        accounts.findByEmail(email, function (error, result) {
            if (error) {
                res.status(500).json(error);
            } else {
                res.json(result);
            }
        });
    }
)


router.get('/accounts/:aid/salarys/:sid', function (req, res, next) {  //得到指定的salary
    salarys.find(req.params.aid, req.params.sid, function (err, thing) {
        if (thing) {
            res.json(result);
        } else {
            res.status(404).send('no such thing');
        }
    });
});

router.post('/accounts/:aid/:uid/salarys', function (req, res, next) { // 创建一个新的salary
    console.log('acc',req.params.uid)
    accounts.findById(req.params.uid, function (err, result) {
        if (err) res.status(500).send({'msg': 'Error no such account!'})
        else {
            var newsalary = req.body || {};
            newsalary.basic_salary = result.basic_salary;
            console.log('salary',newsalary);
            salarys.create(req.params.uid, newsalary, function (err, thing) {
                if (err) {
                    res.status(500).send({'msg': 'Error creating thing'});
                } else {
                    res.send(thing);
                }
            });
        }

    })
});

router.put('/accounts/:aid/salarys/:sid', function (req, res, next) { // 修改指定的salary
    salarys.update(req.params.aid, req.params.sid, req.body, function (err, thing) {
        if (err) {
            res.status(403).json({msg: err});
        } else {
            res.json(thing);
        }
    });
});

module.exports = router;


