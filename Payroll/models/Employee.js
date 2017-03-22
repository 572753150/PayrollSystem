var mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    "eid": Number,
    "password": String,
    "tax": Number,
    "department": String,
    "salary": Number,
    "deduction": Number,
    'rank': String,
    'sex':String,
    'birth':String,
    'first_name':String,
    'last_name':String,
    'date':String,
    'status':String,
});
employeeSchema.methods.hire = function (callback) {
    this.save(callback);
}
employeeSchema.statics.findAll = function ( cb) {
    this.model('Employee').find({}, cb);
}
employeeSchema.methods.fire = function (cb) {
    this.status='blocked';
    this.save(cb);

}
employeeSchema.statics.findByEid = function (eid, cb) {
    this.model('Employee').findOne({eid: eid}, cb);
}

//model
var Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;