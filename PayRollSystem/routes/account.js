var Account = require('./accountModel');

function init( cb ) {
    var saved = 0;
    var result = [];
    const accountDb = [["bilbo", "baggins"], ["frodo", "baggins"], ["samwise", "gamgee"]].forEach( (names,index) => {
        var account = new Account( {
            name : { first : names[0], last : names[1] },
            password : "123",
            email : names[0] + "@mordor.org",
            phone : 1234567890,
            address : "123wer",
            basic_salary : 8000,
            priority : index + 1,
            enabled : true
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

function findAll( account, cb ) {
    Account.find( {priority : {$lt: account.priority}}, cb );
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

function updateAccount(id, newAccount, cb){
    Account.findById(id, function (err, account){
       if(err){cb(err, null)}
       else{
           delete newAccount.id;
           Account.update({_id:account.id},{$set:newAccount},cb);
        }
    });
}
