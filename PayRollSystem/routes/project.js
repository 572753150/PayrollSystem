var Project = require('./projectModel');

function createProject(newproject, cb) {
    new Project(newproject).save(cb);
}
module.exports.createProject = createProject;


function findProjectByid(projectid, cb) {
    Project.findOne({'_id' : projectid}, cd);
}
module.exports.findProjectById = findProjectByid;

function findProjectByname(filter, cb) {
    var containsRegEx = ".*"+ filter + ".*";
    var query = { 'name' : { $regex : containsRegEx } };
    Project.find(query, cb);
}
module.exports.retrieveProjecstByName = findProjectByname;

function assignProject(pid, newproject, cb){
    Project.findOne({'_id' : pid}, function(err, project){
       if(err){
           cb(err, null);
       } else{
           var id = project.id;
           delete project.id;
           project.developer = newproject.developer;
           //是否要设置cost
           Project.update({'_id' : id}, project, cb);
       }
    });
}
module.exports.assignProject = assignProject;


function getProjectInDepartment(departments, cb){
    var query = {};
    var result = [];
    for( var i =0; i < departments.length; i ++){
        var condint = {'department' : departments[i]};
        result.push(condint);
    }
    console.log("array", result);
    query.$or = result;
    Project.find(query, cb);
}
module.exports.getProjectInDepartment = getProjectInDepartment;

function updateProjectdeveloper(developerid, cb){
    Project.find({}, function (err, result) {
        for(var i =0; i < result.length; i++){
            var developers = result[i].developers;
            if(developers[developerid]){
                delete developers[developerid];
                var id = result[i].id;
                delete result[i].id;
                Project.update({'_id' : id}, result[i], cb);
            }
        }
    });
}