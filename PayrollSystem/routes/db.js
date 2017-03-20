/**
 * Created by apple on 2017/3/1.
 */
var mongoClient=require('mongodb').MongoClient;

var db;
mongoClient.connect("mongodb://localhost:27017/WordGame", function(err, database) {
    if(err) throw err;
    db = database;
});

module.exports = { collection : (name) => db.collection(name) };