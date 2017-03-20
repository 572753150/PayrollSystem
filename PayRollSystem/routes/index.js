var express = require('express');
var router = express.Router();
var fs = require('fs');
var worldListArr = new Array();
var games=require("./games")
var Game = require('./gameModel');

function chooseWord(level) {
    var index = Math.floor(Math.random() * worldListArr.length);
    console.log(level.minLength + "   " + level.maxLength);
    for (; ;) {
        if (worldListArr[index].length >= level.minLength && worldListArr[index].length <= level.maxLength) {
            break;
        } else {
            index = Math.floor(Math.random() * worldListArr.length);
        }
    }
    return worldListArr[index];
}

function game(colors, font, guesses, id, level, remaining, status, target, timestamp, timeToComplete, view, userId) {
    this.colors = colors;
    this.font = font;
    this.guesses = guesses;
    this.id = id;
    this.level = level;
    this.remaining = remaining;
    this.status = status;
    this.target = target;
    this.timeStamp = timestamp;
    this.timeToComplete = timeToComplete;
    this.view = view;
    this.userId = userId;
}


var metaData = {
    "levels": {
        "easy": {"name": "easy", "minLength": 3, "maxLength": 5, "guesses": 8},
        "medium": {"name": "medium", "minLength": 4, "maxLength": 10, "guesses": 7},
        "hard": {"name": "hard", "minLength": 9, "maxLength": 300, "guesses": 6}
    },
    "fonts": [{
        "url": "https://fonts.googleapis.com/css?family=Acme",
        "rule": "'Acme', Sans Serif",
        "family": "Acme",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Alef",
        "rule": "'Alef', Sans Serif",
        "family": "Alef",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Almendra",
        "rule": "'Almendra', Serif",
        "family": "Almendra",
        "category": "Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Amiko",
        "rule": "'Amiko', Sans Serif",
        "family": "Amiko",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Armata",
        "rule": "'Armata', Sans Serif",
        "family": "Armata",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Artifika",
        "rule": "'Artifika', Serif",
        "family": "Artifika",
        "category": "Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Bentham",
        "rule": "'Bentham', Serif",
        "family": "Bentham",
        "category": "Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Cabin%20Sketch",
        "rule": "'Cabin Sketch', Display",
        "family": "Cabin Sketch",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Capriola",
        "rule": "'Capriola', Sans Serif",
        "family": "Capriola",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Content",
        "rule": "'Content', Display",
        "family": "Content",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Contrail%20One",
        "rule": "'Contrail One', Display",
        "family": "Contrail One",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Convergence",
        "rule": "'Convergence', Sans Serif",
        "family": "Convergence",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Delius%20Unicase",
        "rule": "'Delius Unicase', Handwriting",
        "family": "Delius Unicase",
        "category": "Handwriting"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Didact%20Gothic",
        "rule": "'Didact Gothic', Sans Serif",
        "family": "Didact Gothic",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Dorsa",
        "rule": "'Dorsa', Sans Serif",
        "family": "Dorsa",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Dynalight",
        "rule": "'Dynalight', Display",
        "family": "Dynalight",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=El%20Messiri",
        "rule": "'El Messiri', Sans Serif",
        "family": "El Messiri",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Flamenco",
        "rule": "'Flamenco', Display",
        "family": "Flamenco",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Fugaz%20One",
        "rule": "'Fugaz One', Display",
        "family": "Fugaz One",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Galada",
        "rule": "'Galada', Display",
        "family": "Galada",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Geostar%20Fill",
        "rule": "'Geostar Fill', Display",
        "family": "Geostar Fill",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Gravitas%20One",
        "rule": "'Gravitas One', Display",
        "family": "Gravitas One",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Gudea",
        "rule": "'Gudea', Sans Serif",
        "family": "Gudea",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=IM%20Fell%20English",
        "rule": "'IM Fell English', Serif",
        "family": "IM Fell English",
        "category": "Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Kranky",
        "rule": "'Kranky', Display",
        "family": "Kranky",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Kreon",
        "rule": "'Kreon', Serif",
        "family": "Kreon",
        "category": "Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Lobster",
        "rule": "'Lobster', Display",
        "family": "Lobster",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Lora",
        "rule": "'Lora', Serif",
        "family": "Lora",
        "category": "Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Medula%20One",
        "rule": "'Medula One', Display",
        "family": "Medula One",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Miss%20Fajardose",
        "rule": "'Miss Fajardose', Handwriting",
        "family": "Miss Fajardose",
        "category": "Handwriting"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Molle",
        "rule": "'Molle', Handwriting",
        "family": "Molle",
        "category": "Handwriting"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Moulpali",
        "rule": "'Moulpali', Display",
        "family": "Moulpali",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Open%20Sans%20Condensed",
        "rule": "'Open Sans Condensed', Sans Serif",
        "family": "Open Sans Condensed",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Over%20the%20Rainbow",
        "rule": "'Over the Rainbow', Handwriting",
        "family": "Over the Rainbow",
        "category": "Handwriting"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Padauk",
        "rule": "'Padauk', Sans Serif",
        "family": "Padauk",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Podkova",
        "rule": "'Podkova', Serif",
        "family": "Podkova",
        "category": "Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Risque",
        "rule": "'Risque', Display",
        "family": "Risque",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Sahitya",
        "rule": "'Sahitya', Serif",
        "family": "Sahitya",
        "category": "Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Sarala",
        "rule": "'Sarala', Sans Serif",
        "family": "Sarala",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Shadows%20Into%20Light",
        "rule": "'Shadows Into Light', Handwriting",
        "family": "Shadows Into Light",
        "category": "Handwriting"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Source%20Serif%20Pro",
        "rule": "'Source Serif Pro', Serif",
        "family": "Source Serif Pro",
        "category": "Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Squada%20One",
        "rule": "'Squada One', Display",
        "family": "Squada One",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Yesteryear",
        "rule": "'Yesteryear', Handwriting",
        "family": "Yesteryear",
        "category": "Handwriting"
    }],
    "ttl": 180000,
    "defaults": {
        "colors": {"guessBackground": "#ffffff", "wordBackground": "#aaaaaa", "textBackground": "#000000"},
        "level": {"name": "medium", "minLength": 4, "maxLength": 10, "guesses": 7},
        "font": {
            "url": "https://fonts.googleapis.com/css?family=Acme",
            "rule": "'Acme', Sans Serif",
            "family": "Acme",
            "category": "Sans Serif"
        }
    }
};

var fontsList = metaData.fonts;
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}


fs.readFile(__dirname + "/../routes/wordlist.txt", {encoding: 'utf8'}, function (err, data) {
    if (err) {
        console.error(err);
        return;
    }
    worldListArr = data.split("\r\n")
});

/* GET home page. */
router.get('/wordgame', function (req, res, next) {
    res.sendFile('index.html', {root: __dirname + "/../public"});
});


router.get('/wordgame/api/v2/meta', function (req, res, next) {
    // console.log(metaData)
    res.send(metaData);
});

router.get('/wordgame/api/v2/meta/fonts', function (req, res, next) {
    res.send(fontsList);
});

router.get('/wordgame/api/v2/:userId/games', function (req, res, next) {//发送games
    var userId=req.params.userId;
    games.findByUserId(userId,function (err,games) {
        if(err){

        }else {
            var gamesAfterCheck=new Array();
            games.forEach(game=>{
                gamesAfterCheck.push(checkStatus(game));
            })
            res.json(gamesAfterCheck);
        }
    })
})

router.post('/wordgame/api/v2/:userId', function (req, res, next) {
    var fontObject;
    // var levelObject = metaData.levels[req.query.level];
    // var remaining = metaData.levels[req.query.level].guesses;
    var status = "unfinished";
    var target = chooseWord(metaData.levels[req.query.level]);
    var view = "";
    // var timestamp = Date.now();
    for (var i = 0 in target) {
        view += "_";
    }
    var userId = req.params.userId;
    for (var i = 0 in fontsList) {
        if (fontsList[i].family == req.header('X-font')) {
            fontObject = fontsList[i];
            break;
        }
    }
    var colors = req.body;
    games.create(colors, fontObject, "", guid(), metaData.levels[req.query.level], metaData.levels[req.query.level].guesses,  "unfinished", target, Date.now(), "", view, req.params.userId,function (err, game) {
        if (err){
            res.status( 500 ).send( { 'msg' : 'Error creating game' } );
        }else{
            console.log(game.target)
            res.send(checkStatus(game));
        }
    })
});

router.get('/wordgame/api/v2/:userId/:gid', function (req, res, next) {
    var gamesId=req.params.gid;
    console.log(gamesId);
    games.find(gamesId,function (err, game) {

        if (err){
            console.log(err);
            res.json( { msg : 'error' } );
        }else{
            res.send(checkStatus(game));
        }
    });
});

router.post('/wordgame/api/v2/:userId/:gid/guesses', function (req, res, next) {
    var flag;
    var guess = req.query.guess;
    console.log(guess);
    games.find(req.params.gid,function (err, game) {
        if(err){
            res.status( 403 ).json( { msg : 'error' } );
        }else {
            var target=game.target;
            if (target.indexOf(guess.toLowerCase()) != -1) {
                var indexArr = new Array();
                for (var i in target) {
                    if (target[i] == guess.toLowerCase()) {
                        indexArr.push(i)
                    }
                }
                var viewArr = game.view.split("");
                for (var i in indexArr) {
                    viewArr[indexArr[i]] = guess.toLowerCase();
                }
                var newView = viewArr.join("");
                if (newView == game.view) {
                    game.remaining--;
                } else {
                    game.view = newView;
                }
            } else {
                game.remaining--;
            }
            if (game.view.indexOf("_") == -1 && game.remaining >= 0) {
                game.status = "win";
                game.timeToComplete = Date.now() - game.timeStamp;
            }
            if (game.view.indexOf("_") != -1 && game.remaining <= 0) {
                game.status = "loss";
                game.timeToComplete = Date.now() - game.timeStamp;
            }
            var newGame = new Game(game.colors, game.font, game.guesses+guess, game.id, game.level, game.remaining, game.status, game.target,
                game.timestamp, game.timeToComplete, game.view, game.userId);
            games.update(game.id,newGame,function (err, game) {
                if(err){
                    res.status( 403 ).json( { msg : 'error' } );
                }else {
                    res.send(checkStatus(game));
                }
            })
        }
    });
});

function checkStatus(game) {
    if(game.status=="win"||game.status=="loss"){
    }else {
        game.target="";
        game.timeToComplete='';
    }
    return game;
}

module.exports = router;

