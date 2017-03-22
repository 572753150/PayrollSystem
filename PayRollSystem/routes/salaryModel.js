var mongoose = require('mongoose');

var salarySchema = mongoose.Schema({
    owner : mongoose.Schema.ObjectId,
    basic_salary: Number,
    deduction : {
        type : Number,
        default:0
    },
    reward : {
        type : Number,
        default:0
    },
    tax : {
        type : Number,
        default:0.055
    },
    final : Number,
    time : {
        type : Date,
        default:Date.now
    }
});

salarySchema.set('toJSON', {
    transform : function( doc, result, options ) {
        result.id = result._id;
        delete result._id; // mongo internals
        delete result.__v; // mongo internals
    }
} );

var Salary = mongoose.model('Salary', salarySchema );

module.exports = Salary;