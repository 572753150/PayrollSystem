
var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
    start : String,
    end : String,
    name : String,
    department : [String],
    developers : {},
    cost : Number,
});

projectSchema.set('toJSON', {
   transform : function (doc, result, options) {
       result.id = result._id;
       delete result._id;
       delete result.__v;
   }
});

var Project = mongoose.model('Project', projectSchema);

module.exports = Project;