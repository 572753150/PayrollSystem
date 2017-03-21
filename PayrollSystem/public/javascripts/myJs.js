var state = {
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

$(document).ready(function () {
    $.ajax({
        url: '/user',//check 是否有user
        method: 'GET',
        success: function (user, status, request) {
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

    state.user = data;
    setPage(data ? 'content' : 'login')
    console.log(data)
    if (data.priority == 1) {
        $("#hireTab").hide();
        $("#updateTab").hide();
    }
    $("#showUser").text(data ? data.email : null);
    $("#label_name").text(data ? (data.name.first + " " + data.name.last) : null);
    $("#label_phone").text(data ? data.phone : null);
    $("#label_adderss").text(data ? data.address : null)
    $("#label_basic_salary").text(data ? data.basic_salary : null);
}

function login(evt) {
    event.preventDefault();
    var username = $('#username').val();
    var password = $('#password').val();
    $('#username').val('');
    $('#password').val('');
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (username != '' && password != '' && re.test(username)) {
        $.ajax({
            url: '/login',
            method: 'POST',
            data: {"username": username, "password": password},
            success: function (data) {
                setUser(data)
            },
            error: function () {
                alert(" invalid username or password!aaa")
            }
        });
    } else {
        alert("invalied input!!")
    }
}

function hireEmplyee(event) {
    event.preventDefault();
    if ($("#eamil").val()==""||$("#firstName").val()==""||$("#lastName").val()==""||$("#address").val()==""||$("#phone").val()==""||$("#title").val()==""||$("#basic_salary")==""){
        alert("Please fill completely!");
        return;
    }
    var info = {
            email: $("#eamil").val(),
            name: {
                first: $("#firstName").val(),
                last: $("#lastName").val(),
            },
            address: $("#address").val(),
            phone: $("#phone").val(),
            title: $("#title").val(),
            basic_salary: $("#basic_salary"),
            priority: parseInt($("#priority").val()),
        }

    $.ajax({
        url: 'api/accounts/' + state.user.id + '/',
        method: 'POST',
        data: info,
        success: function () {
                alert("Hire successfully!")
        }
    });
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
function retrieveEmployee(){
    $.ajax({
        url : 'api/accounts',
        method:'GET',
        success: updateTable
    });
}







