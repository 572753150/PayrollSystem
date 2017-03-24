var Account = require('./accountModel');

function init( cb ) {
    var saved = 0;
    var result = [];
    const accountDb = [["bilbo", "baggins","admin",["Market","IT","Service"]], ["frodo", "baggins","manager",["Market","IT","Service"]], ["samwise", "gamgee","developer",["Market","IT","Service"]]].forEach( (names,index) => {
        var account = new Account( {
            name : { first : names[0], last : names[1] },
            password : "123",
            sex : "male",
            rank : names[2],
            birth : "1976/1/2",
            email : names[0] + "@mordor.org",
            salary : 8000,
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

/*
 * accountDb is an object having
 * account.email as keys
 * and account objects as values
 */
function save( account, cb ) {
    new Account(account).save( cb );
}
module.exports.save = save;

function  findManager(cb) {
    Account.find({status : "true",rank :{$ne : "developer"} }, cb);
}
module.exports.findManager = findManager;

function findAll( account, cb ) {
    Account.find({status : "true"}, cb );
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

function updateAccount(aid, newAccount, cb){
    Account.findOne({'_id' : aid},function (err, data) {
        if(err){
            cb(err, null);
        }else{
            data.rank = newAccount.rank;
            data.department = newAccount.department;
            data.salary = newAccount.salary;
            data.manager = newAccount.manager;
            if(newAccount.firedate){
                data.firedate = newAccount.firedate;
                data.status = "false";
            }
        }
    })

}
module.exports.updateAccount = updateAccount;
