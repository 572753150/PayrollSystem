var Account = require('./accountModel');
var bcrypt = require('bcrypt-nodejs');

function init( cb ) {
    var saved = 0;
    var result = [];
    const accountDb = [["bilbo", "baggins","admin",["Market","IT","Service"]], ["frodo", "baggins","manager",["Market","IT","Service"]], ["samwise", "gamgee","developer",["Market","IT","Service"]]].forEach( (names,index) => {
        var account = new Account( {
            name : { first : names[0], last : names[1] },
            password : bcrypt.hashSync("123"),
            sex : "male",
            rank : names[2],
            birth : "1976/1/2",
            email : names[0] + "@mordor.org",
            salary : 100000,
            department : names[3],
            hiredate: "1997/12/13",
            status : "true"
        } );
        account.save( function(err, savedAccount ) {
            result.push( savedAccount );
            if( result.length == 3 ) cb( null, result );
        } );
    } );
};
module.exports.init = init;

function save( newaccount, cb ) {
    Account.findOne({'email' : newaccount.email}, function (err, account) {
        if(account){
            cb({msg : "already have one!!"}, null);
        }else{
            console.log("******new-account",newaccount);
            new Account(newaccount).save( cb );
        }
    })

}
module.exports.save = save;

function  findManager(cb) {
    Account.find({status : "true",rank :{$ne : "developer"} }, cb);
}
module.exports.findManager = findManager;

function findAll( account, cb ) {
    if(account.rank == "admin"){
        Account.find({status : "true",'_id' :{$ne : account.id} }, cb );
    }
    if(account.rank == "manager"){
        Account.find({status : "true",'_id' :{$ne : account.id}, rank : {$ne : "admin"} }, cb );
    }

}
module.exports.findAll = findAll;

function findById( id, cb ) {
    Account.findOne( { '_id' : id }, cb );
}
module.exports.findById = findById;

function findByEmail( email, cb ) {
    Account.findOne( { 'email' : email }, cb );
}
module.exports.findByEmail = findByEmail;

function findByCondition( email, cb ) {
    Account.find( { 'email' : email }, cb );
}
module.exports.findByCondition = findByCondition;

function updateAccount(aid, newAccount, cb){
    console.log("newacount",newAccount)
    Account.findOne({'_id' : aid},function (err, data) {
        console.log("account_date", data);
        if(err){
            cb(err, null);
        }else{
            data.rank = newAccount.rank;
            data.department = newAccount.department;
            data.salary = newAccount.salary;
            data.add_salary = newAccount.add_salary;
            data.superior = newAccount.superior;
            data.manager = newAccount.manager;
            data.promotiondate = newAccount.promotiondate;
            if(newAccount.firedate){
                data.firedate = newAccount.firedate;
                data.status = "false";
            }
            data.save(cb);
        }
    })

}
module.exports.updateAccount = updateAccount;


function getAccountByApartment(departments, cb) {
    var query = { status : "true", rank : "developer" };
    var result = [];
    for( var i =0; i < departments.length; i ++){
        var condint = {'department' : departments[i]};
        result.push(condint);
    }
    console.log("array", result);
    query.$or = result;
    Account.find(query, cb);
}
module.exports.getAccountByApartment = getAccountByApartment;