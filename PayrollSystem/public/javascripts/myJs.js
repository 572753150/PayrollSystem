
var state = {
    user: null,
    page:{pages:["login","content"],page:null}
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

$(document).ready(function () {
    $.ajax({
        url: '/user',//check 是否有user
        method: 'GET',
        success: function (user,status,request) {
            $('body').show().addClass('background');
            setUser(user);
        },
        error: () => {
            $('body').show().addClass('background');
            setPage('login');
        }
    });
})

function setUser(data) {

    state.user=data;
    setPage(data?'content':'login')
    console.log(data)
    $("#showUser").text(data?data.email:null);
    $("#label_name").text(data?(data.name.first+" "+data.name.last):null);
    $("#label_phone").text(data?data.phone:null);
    $("#label_adderss").text(data?data.address:null)
    $("#label_basic_salary").text(data?data.basic_salary:null);
}

function login(evt) {
    event.preventDefault();
    var username = $('#username').val();
    var password = $('#password').val();
    $('#username').val('');
    $('#password').val('');
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (username != '' && password != ''&& re.test(username)) {
        $.ajax({
            url: '/login',
            method: 'POST',
            data: {"username" : username, "password": password},
            success: function (data) {
                setUser(data)
            },
            error: function () {
                alert(" invalid username or password!aaa")
            }
        });
    }else {
        alert("invalied input!!")
    }
}






function logout(evt) {
    $.ajax({
        url: '/logout',
        method: 'POST',
        success: function () {
            setUser(null);


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







