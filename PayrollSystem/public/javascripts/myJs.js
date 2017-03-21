var metaData;
var levels;
var guessesNum;
var defaultsOfMeta;
var csrf;
function colorGroup(guessBackground, textBackground, wordBackground) {
    this.guessBackground = guessBackground;
    this.textBackground = textBackground;
    this.wordBackground = wordBackground;
};

var state = {
    game: null,
    user: null,
    page: {pages: ["login", "content"], page: null}
}

function setPage(page) {
    state.page.page = page;
    if (page == "login") {
        $('body').addClass('background');
    } else {
        $('body').removeClass('background');
    }

    if (page == 'content') {

    }

    state.page.pages.forEach(
        p => {
            var selector = "#" + p;
            state.page.page == p ? $(selector).show() : $(selector).hide();
        }
    );
}


function login(evt) {
    evt.preventDefault();
    var password = $('#password').val();
    var username = $('#username').val();
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

    $('#password').val('');
    $('#username').val('');
    if (username != '' && password != ''&& reg.test(username)) {
        $.ajax({
            url: "/wordgame/api/v2/login",
            data: {"username": username, "password": password},
            method: 'POST',
            success: function (data, status,request) {
                if (data.msg) {
                    alert(data.msg)
                } else {
                    csrf=request.getResponseHeader("csrf");
                    setUser(data);
                    $(".useless").removeAttr("onchange");
                    loadResourece();
                    createTable(data.email)
                    $(".useless").attr("onchange","updateDefaults();");

                }
            }
        })
    } else {
        alert("Please enter valid username and password!")
    }
}

function loadResourece() {

    $(".useless").removeAttr("onchange");
    $.ajax({
        url: '/wordgame/api/v2/meta/fonts',
        method: 'GET',
        success: showFonts,
        error: function (xhr, status, errorThrown) {
            alert("Sorry, there was a problem!" + errorThrown);
        },
    });

        $.ajax({
            url: '/wordgame/api/v2/meta',
            method: 'GET',
            success: function (data) {
                metaData = data;
                levels = metaData.levels;
                defaultsOfMeta=metaData.defaults;
                showLevels();
                setUserDefaults();
                $(".useless").attr("onchange","updateDefaults();");

            },
            error: function (xhr, status, errorThrown) {
                alert("Sorry, there was a problem!" + errorThrown);
            },
        });

}


function showLevels() {

    var levelNOde = $('#level');
    for(i in levels) {
        levelNOde.append("<option id='" + levels[i].name + "'>" + levels[i].name + "</option>")
    }
}

function setUserDefaults() {
    if (state.user&&state.user.defaults&&state.user.defaults.font){
        $("#font").val(state.user.defaults.font.family);
        $("#level").val(state.user.defaults.level.name);
        $('input#guessColor').val(state.user.defaults.colors.guessBackground);
        $('input#textColor').val(state.user.defaults.colors.textBackground);
        $('input#wordColor').val(state.user.defaults.colors.wordBackground)
    }else {
        $("#font").val(defaultsOfMeta.font.family);
        $("#level").val(defaultsOfMeta.level.name);
        $('input#guessColor').val(defaultsOfMeta.colors.guessBackground);
        $('input#textColor').val(defaultsOfMeta.colors.textBackground);
        $('input#wordColor').val(defaultsOfMeta.colors.wordBackground)
    }
}

function logout(evt) {
    $.ajax({
        url: '/wordgame/api/v2/logout',
        method: 'POST',
        success: function () {
            setUser(null);
            csrf='';
            $(".useless").removeAttr("onchange");

            $("#level").empty();
            $("#font").empty();

        }
    });
}

// $(document).ready(function () {
//     $.ajax({
//         url: '/wordgame/api/v2/user',//check 是否有user
//         method: 'GET',
//         success: function (user,status,request) {
//             csrf=request.getResponseHeader('csrf');
//             $('body').show().addClass('background');
//             setUser(user);
//             createTable(user.email);
//             $(".useless").removeAttr("onchange");
//             loadResourece();
//         },
//         error: () => {
//             $('body').show().addClass('background');
//             setPage('login');
//         }
//     });
// })

function setUser(user) {
    state.user = user;
    $('#email').text(user && user.email);//
    setPage(user ? 'content' : 'login')//这里有什么情况
}

function showFonts(data) {
        var fontNOde = $('#font');
        var head = $('#head');
        var fontList = data;
        for (i in fontList) {
            var fontObject = fontList[i];
            var name = fontObject.family;
            fontNOde.append("<option>" + name + "</option>");
        }
}

function validateCsrf(data) {
    if(data.msg&&data.msg=="logout"){
        logout();
        return true;
    }else {
        return false;
    }
}


function updateDefaults() {
    var colors = new colorGroup($('input#guessColor').val(), $('input#textColor').val(), $('input#wordColor').val());
    var fontsList=metaData.fonts;
    var fontObject;
    for (var i = 0 in fontsList) {
        if (fontsList[i].family == $("#font").val()) {
            fontObject = fontsList[i];
            break;
        }
    }
    var level=metaData.levels[$("#level").val()]
    var defaults=new Default(colors,level,fontObject);

    $.ajax({
        method:'PUT',
        url:"/wordgame/api/v2/"+state.user.email+"/defaults",
        data: defaults,
        headers: {'csrf':csrf},
        success:function (data) {
            if(validateCsrf(data)){return};
            if(data.msg){
                alert(data.msg);
            }
        }
    })
}

function createGame() {
    $("div.row").stop();
    $("#createGame").hide();
    var colors = new colorGroup($('input#guessColor').val(), $('input#textColor').val(), $('input#wordColor').val());
    $.ajax({
        method: 'POST',
        url: '/wordgame/api/v2/' + state.user.email + "?level=" + $('#level').val(),
        data: colors,
        headers: {'X-font': $('#font').val(),'csrf':csrf},
        success: function (data) {
            if(validateCsrf(data)){return};

            if (data.msg == undefined) {
                state.game = data;
                $("#head").append("<link rel='stylesheet' href='" + state.game.font.url + "'>");
                createViewPage();
            }
            else {
                return alert(data.msg);
            }
        },
        error: function (xhr, status, errorThrown) {
            alert("Sorry, there was a problem!" + errorThrown);
        },
    });
}

function createViewPage() {
    $("div.row").stop(false, true);
    $("div.row").slideUp();
    var node = $("div.container");
    var divWell = $("<div class='well well-sm base ' name='divWell' id='" + state.game.id + "'></div>");
    var div = $("<div class='form-inline' ></div>");
    var div2 = $("<div class='form-inline layout-right' name='div2' ></div>");
    var div3 = $("<div class='form-inline'  ></div>");
    node.append(divWell);
    divWell.append(div);
    guessesNum = state.game.remaining;
    div.append($("<label class='right guessForFirsline'id='remaining" + state.game.id + "' ><script>$('#remaining'+state.game.id).text(function() {return guessesNum+' guesses remaining'; })</script></label>"),
        $("<input   name='inputOfGuess' class='widthOfInput form-control right guessForFirsline '>"),
        $('<span  class="btn btn-sm btn-primary guessForFirsline" onclick="guess()">Guess</span>'),
        $('<button  onclick="klose()" type="button" class="close cleanAlpha" aria-label="Close" ><span  class="duiqi">&times;</span></button>'));
    divWell.append(div2);
    if (state.game.guesses =="") {
    } else {
        for (var i in state.game.guesses) {
            var label = "<label style='background-color: " + state.game.colors.guessBackground + ";font-size: 40px ;color:" + state.game.colors.textBackground + ";font-family:" + state.game.font.family + "' class='labelOfWord gap'  >" + state.game.guesses[i].toUpperCase() + "</label>";
            div2.append(label);
        }
    }
    divWell.append(div3);
    var color = $('input#wordColor').val();
    for (var l = 0 in state.game.view) {
        var label = "<label name='view" + l + "' style='text-transform:uppercase;background-color: " + state.game.colors.wordBackground + ";color:" + state.game.colors.textBackground + ";font-size: 80px;vertical-align: middle;font-family:" + state.game.font.family + "' class='gap' >" + state.game.view[l].toUpperCase() + "</label>"
        div3.append(label)
    }

}

function klose() {
    $("div.row").stop(false, true);
    $("#second").show();
    $("#createGame").show();
    var gameId = "div#" + state.game.id;
    $(gameId).remove();
    $("div.row").slideUp();
    createTable();
}

function guess() {
    if ((!(/^[A-Za-z]+$|'|-/.test($("[name='inputOfGuess']").val()))) || $("[name='inputOfGuess']").val().length > 1) {
        $("[name='inputOfGuess']").val("");
        return alert(" invalid")
    }
    if (state.game.guesses.toLowerCase().indexOf(($("[name='inputOfGuess']").val().toLowerCase())) != -1 && state.game.guesses != "") {
        $("[name='inputOfGuess']").val("");
        alert("Invalid guess. Already guessed! ");
        return;
    }
    $.ajax({
        method: 'POST',
        url: "/wordgame/api/v2/" + state.user.email + "/" + state.game.id + "/" + "guesses" + "?guess=" + $("[name='inputOfGuess']").val(),
        headers: {'csrf':csrf},
        success: function (data) {
            if(validateCsrf(data)){return};
            state.game = data;
            guessesNum = state.game.remaining;
            $("label#remaining" + state.game.id + "").text(function () {
                return guessesNum + ' ' + 'guesses remaining';
            });
            changeView();
            judgeStatus(state.game);
            var label = "<label style='background-color: " + state.game.colors.guessBackground + ";font-size: 40px ;color:" + state.game.colors.textBackground + ";font-family:" + state.game.font.family + "' class='labelOfWord gap' value='" + $("[name='inputOfGuess']").text() + "' >" + $("[name='inputOfGuess']").val().toUpperCase() + "</label>";
            $('[name="div2"]').append(label)
            $("[name='inputOfGuess']").val('');//

        },
        error: function (xhr, status, errorThrown) {
            alert("Sorry, there was a problem!" + errorThrown);
        },
    });

}


function createTable() {
    $("#table").empty();
    $("#table").append("<tr><th >Level</th> <th>Phrase</th><th>Remaining</th><th>Answer</th><th>Status</th></tr>");
    $.ajax({
        url:'/wordgame/api/v2/'+state.user.email+'/games',
        method:"GET",
        headers: {'csrf':csrf},
        success:function (data) {
            if(validateCsrf(data)){return};
            data.forEach( game=> {
                $("#head").append("<link rel='stylesheet' href='" + game.font.url + "'>");
                $('#table').append("<tr><th>" + game.level.name + "</th><th name='" + game.id + "'></th><th>" + game.remaining + "</th><th style='text-transform:uppercase'>" + game.target + "</th><th>" + game.status + "</th> </tr>>");
                for (var i in game.view) {
                    var label = "<label style='background-color: " + game.colors.wordBackground + ";font-size: 30px ;color:" + game.colors.textBackground + ";font-family:" + game.font.family + "' class='labelOfWord gap' >" + game.view[i].toUpperCase() + "</label>";
                    $("[name='" + game.id + "']").append(label);
                }
                $("[name='" + game.id + "']").click(function (event) {
                    var currentElement = event.currentTarget;
                    var gameId = $(currentElement).attr("name");
                    $("#second").hide();
                    resumeGame(gameId);
                })
                }
            );

        }
    })


}

function resumeGame(gameid) {
    $.ajax({
        url: '/wordgame/api/v2/' + state.user.email + '/' + gameid,
        method: 'GET',
        headers: {'csrf':csrf},
        success: function (data) {
            if(validateCsrf(data)){return};
            state.game = data;
            createViewPage();
            judgeStatus(state.game);
        },
        error: function (xhr, status, errorThrown) {
            alert("Sorry, there was a problem!" + errorThrown);
        },
    });
}


function changeView() {
    for (var i in state.game.view) {
        $("[name='view" + i + "']").text(state.game.view[i]);
    }
}

function judgeStatus(game) {
    if (game.status == "unfinished") {
    }
    if (game.status == "loss") {
        $(".guessForFirsline").hide();
        $("[name='divWell']").attr("style", "background:url(http://charity.cs.uwlax.edu/views/cs402/homeworks/hw2/images/cry.gif)")
    }
    if (game.status == "win") {
        $(".guessForFirsline").hide();
        $("[name='divWell']").attr("style", "background:url(http://charity.cs.uwlax.edu/views/cs402/homeworks/hw2/images/winner.gif)")
    }
}

function Default(colors, level, font) {
    this.colors=colors;
    this.level=level;
    this.font=font;
}