var Salary = require('./salaryModel');

function create( ownerId, newsalary, cb ) {
    newsalary.owner = ownerId;
    new Salary( newsalary ).save( cb );
};
module.exports.create = create;

function findById( Sid, cb ) {
    Salary.findById( Sid, cb );
};
module.exports.find = findById;

function findByOwner( aid, cb ) {
    var query = { "owner" : aid };
    //
    // if( filter ) {
    //     var containsRegEx = ".*"+ filter + ".*";
    //     query.$or = [
    //         { 'name' : { $regex : containsRegEx } },
    //         { 'value' : { $regex : containsRegEx}  }
    //     ];
    //
    //     if( filter.length == 24 ) {
    //         query.$or.push( { '_id' : filter } );
    //     }
    //}

    Salary.find( query, cb );
};
module.exports.findByOwner = findByOwner;

function update( aid, Sid, object, cb ) {
    Salary.findOne( { owner : aid, '_id' : Sid }, function(err, salary ) {
        if( err ) { cb( err, null ); }
        else {
            salary.deduction = object.deduction;
            salary.reward = object.reward;
            salary.tax = (salary.basic_salary - salary.deduction + salary.reward) * 0.055;
            salary.final = (salary.basic_salary - salary.deduction + salary.reward) * 9.945;
            salary.end = Date.now();
            salary.save( cb );
        }
    } );
};
module.exports.update = update;
