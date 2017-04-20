
var mongoose = require('mongoose');

var accountSchema = mongoose.Schema( {
    name : {
        first : String, last : String
    },
    rank : String,
    sex : String,
    birth : String,
    email : String,
    password : String,
    //department : String,
    salary: Number,//anual salary
    add_salary : {
        type : Number,
        default : 0
    },
    department : mongoose.Schema.Types.Mixed,
    hiredate: String,
    promotiondate : String,
    firedate: String,
    status : String,
    superior : mongoose.Schema.Types.Mixed
});

accountSchema.set('toJSON', {
    transform : function( doc, result, options ) {
        result.id = result._id;
        delete result._id; // mongo internals
        delete result.__v; // mongo internals
    }
} );

var  Account= mongoose.model('Account', accountSchema );

module.exports = Account;
