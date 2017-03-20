/**
 * Created by apple on 2017/3/1.
 */
var db = require('./db');
var mongo = require('mongodb');
var Game = require('./gameModel');
var COLLECTION = 'games';


function create(colors, font, guesses, id, level, remaining, status, target, timestamp, timeToComplete, view, userId, cb) {
    var result = new Game(colors, font, guesses, id, level, remaining, status, target,
        timestamp, timeToComplete, view, userId);
    db.collection(COLLECTION).insertOne(result, function (err, writeResult) {
        cb(err, writeResult.ops[0]);
    })
};
module.exports.create = create;

function findByUserId(userId, cb) {
    db.collection(COLLECTION).find({userId: userId}).toArray(function (err, games) {
        cb(err, games);//
    });
}
module.exports.findByUserId = findByUserId;

function find(gameID, cb) {
    db.collection(COLLECTION).findOne({id:gameID}, function (err, game) {
        cb(err, game);
    })
}
module.exports.find = find;

function update(gameId, newGame, cb) {//cb 很绕
    find(gameId,function (error, game) {
        if(error){
            cb(error);
        }else{
            db.collection(COLLECTION).update({id:gameId},{$set: newGame},function (err, updated) {
                find(gameId,cb);// 不懂
            })
        }
    })
}
module.exports.update = update;

