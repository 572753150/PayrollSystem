var express = require('express');
var router = express.Router();
var accounts = require("./account")
var salarys = require('./salary');
var project = require('./project');

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
        console.log("createNewAccount",newaccount);
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
    console.log("wantedTime",time);
    accounts.findById(req.params.aid, function (err, result) {
        console.log('findUser',result);
        if (err) res.status(500).send({'msg': 'Error no such account!'})
        else {
            salarys.findByOwnerandTime(req.params.aid, time, function (err, data) {
                if(data){
                    res.send([data]);
                }else{
                    var newsalary = {};
                    newsalary.date = time;
                    if(result.promotiondate && compareTime(time, result.promotiondate)){
                        newsalary.gross_salary = (result.salary + result.add_salary) / 12;
                    }else{
                        newsalary.gross_salary = result.salary / 12;
                    }
                    newsalary.deduction = newsalary.gross_salary * 0.25;
                    newsalary.reward = newsalary.gross_salary * 0.15;
                    newsalary.tax = (newsalary.gross_salary - newsalary.deduction + newsalary.reward) * 0.055;
                    newsalary.net_salary = (newsalary.gross_salary - newsalary.deduction + newsalary.reward) * 0.945;
                    console.log("createSalary",newsalary);
                    salarys.create(req.params.aid, newsalary, function (err, salary) {
                        if (err) {
                            res.status(500).send({'msg': 'Error creating salary'});
                        } else {
                            res.send([salary]);
                        }
                    });
                }
            });
        }
    })
});
function compareTime(now, pre){
    return new Date(now) >= new Date(pre);
}

router.put('/accounts/:aid/salarys/:sid', function (req, res, next) { // 修改指定的salary
    salarys.update(req.params.aid, req.params.sid, req.body, function (err, thing) {
        if (err) {
            res.status(403).json({msg: err});
        } else {
            res.json(thing);
        }
    });
});

router.post('/projects/', function (req, res, next) {
    var data = req.body;
    project.createProject(data, function (err, result) {
        if(err){
            res.send({err : 'create failse'});
        }else{
            res.send(result);
        }
    });
});

router.put('/projects/:pid/', function (req, res, next) {

});

router.get('/projects/',function(req, res, next){

    var user = req.session.user;
    if(user.rank == 'manager'){
        console.log("user.department", user.department);
        project.getProjectInDepartment(user.department, function(err, data){
            if(err){
                console.log(err);
                res.send(err);
            }else{
                console.log("data", data);
                res.send(data);
            }
        })
    }else{
        res.send(result);
    }
});

router.get('/departments/developers/', function(req, res, next){
    var user = req.session.user;
    if(user.rank == 'manager'){
        console.log("user.department", user.department);
        accounts.getAccountByApartment(user.department, function(err, data){
            if(err){
                console.log(err);
                res.send(err);
            }else{
                console.log("accounts ::", data);
                res.send(data);
            }
        })
    }else{
        res.send(result);
    }
})

router.get('projects/:pid/', function (req, res, next) {

});

module.exports = router;


