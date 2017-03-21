
var mongoose = require('mongoose');

var accountSchema = mongoose.Schema( {
    name : {
        first : String, last : String
    },

    email : String,

    password : String,

    enabled : Boolean,

    priority : Number,

    address: String,

    phone : Number,

    title : String,

    basic_salary: Number,

    hiredate: {
        type : Date,
        default:Date.now
    },
    firedate: Date
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
