var state = {
    modal: {account: null, project: null},
    user: null,
    page: {pages: ["login", "content", "accountModal", "salaryModal", "projectModal"], page: null},
    superiors: []
}

var rankObj = {
    admin: {
        max: 200000,
        min: 100000
    },
    developer: {
        max: 120000,
        min: 80000
    },
    manager: {
        max: 160000,
        min: 90000
    }

}

function judgesalary(rank, sarlary) {
    if (sarlary <= rankObj[rank].max && sarlary >= rankObj[rank].min) {
        return true
    } else {
        return false
    }
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
    $("#label_rank").text(data ? data.rank : "")
    $("#label_department").text(data ? data.department.join("  , ") : '');
    $("#label_superior").text(data.superior ? (data.superior.name.first + " " + data.superior.name.last) : '');

    retrieveEmployee();
    // $.ajax({
    //     url: "api/accounts/" + state.user.id + "/salarys",
    //     method: "GET",
    //     success: function (data) {
    //         console.log(data)
    //         //updateTable(data);
    //     }
    // })
}

function login(evt) {
    event.preventDefault();
    var username = $('#username').val();
    var password = $('#password').val();
    $('#username').val('');
    $('#password').val('');
    //var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (username != '' && password != '') {
        $.ajax({
            url: '/login',
            method: 'POST',
            data: {"username": username, "password": password},
            success: function (data) {
                console.log("logindata", data);
                if (data.msg) {
                    alert(data.msg);
                } else {
                    setUser(data)
                }

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
    if (judgesalary($("#rank").val(), $("#basic_salary").val())) {
    } else {
        alert("Salary is not correct! Too Low or Too High!")
        return
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
            retrieveEmployee();
            //setSalary(account)
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
            console.log("researchUser", data);
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
    state.modal.account.superior = state.superiors[parseInt($("#superiormodal").val())];
    state.modal.account.department = $("#departmentmodal").val();
    if ($("#fireDateModal").val() != '') {
        state.modal.account.firedate = $("#fireDateModal").val();
    }
    if (judgesalary($("#rankmodal").val(), $("#add_salry").val())) {
    } else {
        alert("Salary is not correct! Too Low or Too High!")
        return
    }
    $("#fireDateModal").val('');

    console.log(state.modal.account)
    $.ajax({

        url: 'api/accounts/' + state.modal.account.id + '/',
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
        $('#add_salry').val(account.salary)
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
    showProject(null)
}


function updateTable(salary) {
    var table = $('#table').empty();
    var props = ['Gross Salary', 'Reward', 'Deduction', 'Tax', 'Net Salary'];
    var propOfData = ['gross_salary', 'reward', 'deduction', 'tax', 'net_salary'];

    // make header
    makeRow('th', props).appendTo(table);
    console.log("salary", salary);
    salary.forEach(singleSalary => {
        var tr = makeRow('td', propOfData.map(p => singleSalary[p].toFixed(2)));
        tr.appendTo(table);
        singleSalary.row = tr;
    });
};

function makeRow(type, values) {
    return $(`<tr><${type}>` + values.join(`</${type}><${type}>`) + `</${type}></${type}>`);
}

function searchSalary() {
    var time = $('#salryDateForSewarch').val();
    console.log('wantedSalaryDate', time);
    if (compareTime(time, state.user.hiredate)) {
        $.ajax({
            url: 'api/accounts/' + state.user.id + '/salarys',
            method: 'POST',
            data: {reseachdate: time},
            success: updateTable
        });
    } else {
        alert("you hav not hired!!!");
    }

}

function compareTime(now, pre) {
    return new Date(now) >= new Date(pre);
}
//------------------------------------------------------------angular part-------------------------------------------------------------------

var app = angular.module('myApp', []);
app.controller('createProjectCT', function ($scope, $http) {
    // $scope.project.start=$filter(new Date());
    // $scope.project.start=$filter('date')($scope.project.start, 'yyyy-MM-dd');

    $scope.createProject = function () {
        $http({
            method: 'POST',
            contentType: 'application/json',
            data: $scope.project,
            url: '/api/projects/'
        }).then(function successCallback(response) {
            alert("Create successfully!");
            $scope.project = {};
        }, function errorCallback(response) {

        });
    }
});

function getProjects() {

    $.ajax({
        method: 'GET',
        contentType: 'application/json',
        data: state.user,
        url: '/api/projects/',
        success: function (data) {
            $("#optionOfProject").empty();

            $("#tableOfProjects").empty();
            var propOfData = ['name', 'start', 'end', 'department'];
            data.forEach(project => {
                var tr = makeRow('td', propOfData.map(p => project[p]));
                var option = "<option value='" + project.id + "'>" + project.name + "</option>"
                console.log(project);
                tr.click((event) => showProject(project));
                $("#tableOfProjects").append(tr);
                $("#optionOfProject").append(option)

            })
        },
    })


    $.ajax({
        method: 'GET',
        contentType: 'application/json',
        data: state.user,
        url: '/api/departments/developers/',
        success: function (data) {
            $("#employee").empty();
            data.forEach(employee => {
                var option = "<option value='" + employee.email + "'>" + employee.name.first + " " + employee.name.last + "</option>"
                $("#employee").append(option)
            })
        },
    })

}

function updateProject() {
    $.ajax({
        url: "api/projects/"+state.modal.project.id,
        method: "PUT",
        date: $("#employee").val(),
        success: function () {

        },
        error: function () {

        }
    });

}

// app.controller('allocateProjectCT', function($scope,$http) {
//     $scope.getprj=function() {
//         $http({
//             method: 'GET',
//             contentType: 'application/json',
//             data: state.user,
//             url: '/api/projects/'
//         }).then(function successCallback(response) {
//             console.log(response.data)
//             $scope.projects = response.data;
//
//         }, function errorCallback(response) {
//
//         });
//     }
//     $scope.getprj();
//     $scope.getAllEmployee=function () {
//         $http({
//             method: 'GET',
//             contentType: 'application/json',
//             data:state.user,
//             url: '/departments/developers/'
//         }).then(function successCallback(response) {
//             $scope.employees=response.data;
//         }, function errorCallback(response) {
//
//         });
//     }
//     $scope.updateProject=function () {
//         $scope.hideTablePart=true;
//         $scope.showUpdatePart=$scope.hideTablePart;
//         $scope.getAllEmployee();
//
//
//
//     }
// });

function showProject(project) {
    state.modal.project = project;
    if (project) {
        // state.modal.project = project;
        $('#projectModal').show();
        $('.tableOfProjects').hide();
        $('#nameOfProject').text(project.name);
    } else {
        $('#projectModal').hide();
        $('.tableOfProjects').show();
    }
}
function searchCost() {
    var pid = $("#optionOfProject").val();
    var date = $("#dateForCost").val();

    $.ajax({
        method: 'GET',
        contentType: 'application/json',
        data:date,
        url: '/api/projects/'+pid+"/cost",
        success: function (data) {
            var cost = data;
            $("#displayCost").show();
            $("#displayCost").val("Cost till "+data+":"+cost);
            console.log(cost)
        },
    })
}

