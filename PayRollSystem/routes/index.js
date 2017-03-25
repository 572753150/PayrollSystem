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
        var newaccount = req.body;
        //console.log(newaccount);
        accounts.save(newaccount, function (err, result) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.json(result);
            }
        });
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

router.put('/accounts/:aid/', function (req, res, next) { // +++++修改指定的account
    accounts.updateAccount(req.params.aid, req.body, function (err, thing) {
        if (err) {
            res.status(403).json({msg: err});
        } else {
            res.json(thing);
        }
    });
});

router.get('/accounts/manager',function (req, res, next) { // ++ 得到managers
   accounts.findManager(function (err, users) {
       //console.log("users",users);
       if(err){
           console.log(err);
       }else{
           res.json(users);
       }
   })
});

router.get('/accounts/:aid/salarys', function (req, res, next) { // 得到所以的salary
    salarys.findByOwner(req.params.aid, function (err, result) {
        if (err) {
            res.json({msg: err});
        } else {
            res.json(result);
        }
    });
});



router.get('/accounts/:email', function (req, res, next) { // ++++通过email找数据
        var email = req.params.email;
        console.log("email",email);
        accounts.findByCondition(email, function (error, result) {
            console.log("researchUser",result);
            if (error) {
                res.status(500).json(error);
            } else {
                res.json(result);
            }
        });
    }
)


router.get('/accounts/:aid/salarys/:sid', function (req, res, next) {  //++++++得到指定的salary
    salarys.find(req.params.aid, req.params.sid, function (err, thing) {
        if (thing) {
            res.json(result);
        } else {
            res.status(404).send('no such thing');
        }
    });
});

router.post('/accounts/:aid/salarys', function (req, res, next) { // +++创建一个新的salary或者返回新的salary
    var time = req.body.reseachdate;
    accounts.findById(req.params.uid, function (err, result) {
        if (err) res.status(500).send({'msg': 'Error no such account!'})
        else {
            salarys.findByOwnerandTime(req.params.uid, time, function (err, data) {
                if(data){
                    res.send(data);
                }else{
                    var newsalary = {};
                    newsalary.date = time;
                    if(result.promotiondate){
                        newsalary.gross_salary = (result.salary + result.add_salary) / 12;
                    }else{
                        newsalary.gross_salary = result.salary / 12;
                    }
                    newsalary.deduction = newsalary.gross_salary * 0.25;
                    newsalary.reward = newsalary.gross_salary * 0.15;
                    newsalary.tax = (newsalary.gross_salary - newsalary.deduction + newsalary.reward) * 0.055;
                    newsalary.net_salary = (newsalary.gross_salary - newsalary.deduction + newsalary.reward) * 9.945;
                    salarys.create(req.params.uid, newsalary, function (err, salary) {
                        if (err) {
                            res.status(500).send({'msg': 'Error creating salary'});
                        } else {
                            res.send(salary);
                        }
                    });
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


