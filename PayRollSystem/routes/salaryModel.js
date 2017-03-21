var mongoose = require('mongoose');

var salarySchema = mongoose.Schema({
    owner : mongoose.Schema.ObjectId,
    basic_salary: Number,
    deduction : Number,
    reward : Number,
    tax : Number,
    final : Number,
    begin : Date,
    end : Date
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