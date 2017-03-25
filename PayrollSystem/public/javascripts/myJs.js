var state = {
    modal: {account: null},
    user: null,
    page: {pages: ["login", "content", "accountModal", "salaryModal"], page: null},
    superiors: []
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

function getAllSuperior() {
    $.ajax({
        url: 'api/accounts/manager',
        method: 'GET',
        success: function (users) {
            console.log("users", users)
            state.superiors = users;
            for (var i = 0; i < users.length; i++) {
                $(".superior").append("<option value=" + i + " >" + users[i].name.first + " " + users[i].name.last + "</optionva>")
            }
        },
    });
}

function setUser(data) {

    state.user = data;
    setPage(data ? 'content' : 'login')
    //console.log(data)
    if (data.rank == "developer") {
        $("#hireTab").hide();
        $("#updateTab").hide();
    } else {
        $("#superior").empty();
        getAllSuperior();
    }
    $("#showUser").text(data ? data.email : null);
    $("#label_name").text(data ? (data.name.first + " " + data.name.last) : null);
    $("#label_birthday").text(data ? data.birth : null);
    $("#label_department").text(data ? data.department.join("  , ") : '');
    $("#label_superior").text(data.superior ? (data.superior.name.last + " " + data.superior.name.last) : '');

    retrieveEmployee();
    $.ajax({
        url: "api/accounts/" + state.user.id + "/salarys",
        method: "GET",
        success: function (data) {
            console.log(data)
            updateTable(data);
        }
    })
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
    if ($("#email").val() == "" || $("#firstName").val() == "" || $("#lastName").val() == "" || $("#setPassword").val() == "" || $("#birthday").val() == "" || $("#hiredate").val() == "" || $("#basic_salary") == "" ||
        $("#department").val().length == 0) {
        alert("Please fill completely!");
        return;
    }
    var superior = state.superiors[$("#superior").val()]
    console.log($("#department").val().length);
    console.log($("#birthday").val());
    var info = {
        email: $("#email").val(),
        password: $("#setPassword").val().trim(),
        name: {
            first: $("#firstName").val(),
            last: $("#lastName").val(),
        },
        rank: $("#rank").val(),
        superior: superior,
        birth: $("#birthday").val(),
        hiredate: $("#hiredate").val(),
        salary: parseInt($("#basic_salary").val()),
        sex: $("#sex").val(),
        department: $("#department").val(),
        status: "true",
    }
    console.log("hireinfo", info)
    $.ajax({

        url: 'api/accounts/' + state.user.id + '/',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(info),
        success: function (account) {
            console.log('acc', account);
            setSalary(account)
            $(".empty").val("");
            $("#superior").empty()
            getAllSuperior();
            alert("Hire successfully!")
        }
    });
}

function setSalary(account) {
    console.log('accww', account);
    $.ajax({
        url: `api/accounts/${state.user.id}/${account.id}/salarys`,
        method: 'POST',
        success: function (ccount) {
            console.log('setsalary', ccount);
        }
    });
}

function search() {
    var email = $("#searchContent").val().trim();
    $.ajax({
        url: 'api/accounts' + "/" + email,
        method: "GET",
        success: function (data) {
            console.log("researchUser",data);
            if (data) {
                updateEmployeeTable(data)
            } else {
                alert("No Such guy!")
            }
        },
        error: function () {

        }

    })
}


function logout(evt) {
    $.ajax({
        url: '/logout',
        method: 'POST',
        success: function () {
            setUser(null);
        },
        error: function () {
            alert('error!!');
        }
    });
}
function retrieveEmployee() {
    $.ajax({
        url: 'api/accounts',
        method: 'GET',
        success: updateEmployeeTable
    });
}

function updateEmployee() {

    state.modal.account.add_salary = parseInt($("#add_salry").val()) - state.modal.account.salary;
    state.modal.account.rank = $("#rankmodal").val();
    state.modal.account.promotiondate = $("#promotiondate").val();
    state.modal.account.superior =state.superiors[ parseInt($("#superiormodal").val())];
    state.modal.account.department = $("#departmentmodal").val();
    if ($("#fireDateModal").val() != '') {
        state.modal.account.firedate = $("#fireDateModal").val();
    }

    console.log(state.modal.account)
    $.ajax({

        url: 'api/accounts/' +state.modal.account.id + '/',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(state.modal.account),
        success: function (account) {


            alert("update successfully!");
            showModal(null);
            retrieveEmployee()
        }
    });

}

function updateEmployeeTable(results) {
    var table = $('#account_table').empty();
    var props = ['Name', 'Email', 'Rank', 'Department', ''];
    var props = ['first', 'last', 'email', 'rank', 'department'];
    // make header
    makeRow('th', props).appendTo(table);

    results.forEach(result => {
        var tr = makeRow('td', props.map(p => result[p] ? result[p] : (result.name[p] ? result.name[p] : '' )));
        tr.click((event) => showModal(result));
        tr.appendTo(table);
        result.row = tr;
    });
}

function showModal(account) {
    state.modal.account = account;
    console.log(account)
    if (account) {
        console.log('accout', account);
        $('#emailmodal').text(account.email);
        $('#namemodal').text(account.name.first + " " + account.name.last);
        $('#salarymodal').text(account.salary);
        $('#account_table').slideUp();
        $('#accountModal').slideDown();
        $('#salaryModal').slideDown();
    } else {
        $('#account_table').slideDown();
        $('#accountModal').slideUp();
        $('#salaryModal').slideUp();
    }
}

function cancel() {
    showModal(null);
}


function updateTable(salary) {
    var table = $('#table').empty();
    var props = ['Basic Salary', 'Reward', 'Deduction', 'Tax', 'gross Salary'];
    var propOfData = ['basic_salary', 'reward', 'deduction', 'tax', 'gross_salary'];

    // make header
    makeRow('th', props).appendTo(table);

    salary.forEach(singleSalary => {
        var tr = makeRow('td', propOfData.map(p => singleSalary[p]));
        tr.appendTo(table);
        singleSalary.row = tr;
    });
};

function makeRow(type, values) {
    return $(`<tr><${type}>` + values.join(`</${type}><${type}>`) + `</${type}></${type}>`);
}





