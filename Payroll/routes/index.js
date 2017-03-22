var express = require('express');
var router = express.Router();
var db = require("../models/db");
var guid = require("../models/guid");
var Employee = require('../models/Employee');

exports.showLogin = (req, res, next) => {

 res.render('login.ejs', {root: __dirname + "/../public"});


};
exports.showFire = (req, res, next) => {
    var user = req.session.user;
    if (user ) {
        res.render('add.ejs', {root: __dirname + "/../public"});

    } else {
        res.render('login');
    }




};
exports.showManage = (req, res, next) => {
    var user = req.session.user;
    if (user ) {
        Employee.findAll(function (err,employees) {
        if(!err){
            res.render('manage', {employees:employees,search:"all"});}
    })

    } else {
        res.render('login');
    }




};
exports.search = (req, res, next) => {
    var user = req.session.user;
    var eid=req.params.eid;
    if (user) {
        Employee.findByEid(eid,function (err,employee) {
            console.log(employee+" "+eid)
            if(!err){
                res.render('manage', {employees:[employee],search:eid});}
        })

    } else {
        res.render('login');
    }




};
exports.info = (req, res, next) => {
    var user = req.session.user;
    var eid=req.params.eid;
    if (user) {
        Employee.findByEid(eid,function (err,employee) {
            console.log(employee)
            if(!err){
                res.send(employee);
            }else {
                res.send('err')
            }
        })

    } else {
        res.render('login');
    }




};
exports.showUser = (req, res, next) => {

    var user = req.session.user;
    if (user ) {
        res.render('user',{employee:user});
    } else {
        res.render('login');
    }


};
exports.fire = (req, res, next) => {
     var eid=req.params.eid;
    var user = req.session.user;
    if (user&&user.rank=="Administrator") {

        Employee.findByEid(eid,function (err,e) {
            if(!err){
                console.log(e)
                e.fire(function (err2) {
                    if(!err2){
                        res.send('success');
                    }else {
                        res.send(err2);
                    }
                })
                return;
            }
            res.send(err);
        })

    } else {
        res.render('login');
    }


};
exports.paystub = (req, res, next) => {
    var user = req.session.user;
    if (user ) {
        res.render('paystub',{employee:user});
    } else {
        res.render('login');
    }



};
exports.showHire = (req, res, next) => {

    res.render('add.ejs', {root: __dirname + "/../public"});


};
exports.hire = (req, res, next) => {

   req.body.password=guid.generatePassword();
    req.body.status="active";
    if(req.rank=='Manager'||req.rank=='Administrator'){
        req.body.tax=parseInt(req.body.salary)*0.115;

    }else {
        req.body.tax=parseInt(req.body.salary)*0.081;
    }
    req.body.deduction=parseInt(req.body.salary)*0.051;

   var e=new Employee(req.body);
   e.hire(function (err,employee) {
       if(err){res.send(err)
       console.log(err)

       };
       res.send(employee);
   })

};

exports.showError = (req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    res.send(err);
};