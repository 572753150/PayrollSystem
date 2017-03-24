var state = {
    modal : {account : null},
    user: null,
    page: {pages: ["login", "content", "accountModal", "salaryModal"], page: null}
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
    $("#label_birthday").text(data ? data.phone : null);
    retrieveEmployee();
    $.ajax({
        url:"api/accounts/"+state.user.id+"/salarys",
        method:"GET",
        success:function (data) {
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
    if ($("#email").val()==""||$("#firstName").val()==""||$("#lastName").val()==""||$("#setPassword").val()==""||$("#birthday").val()==""||$("#hiredate").val()==""||$("#basic_salary")==""||
    $("#department").val().length==0){
        alert("Please fill completely!");
        return;
    }
    console.log($("#department").val().length);
    console.log($("#birthday").val());
    var info = {
        email: $("#email").val(),
        password:$("#setPassword").val().trim(),
        name: {
            first: $("#firstName").val(),
            last: $("#lastName").val(),
        },
        birthday: $("#birthday").val(),
        hiredate: $("#hiredate").val(),
        salary: parseInt($("#basic_salary").val()),
        sex: $("#sex").val(),
        department:$("#department").val()
    }
    console.log(info)
    // $.ajax({
    //
    //     url: 'api/accounts/' + state.user.id + '/',
    //     method: 'POST',
    //     contentType:'application/json',
    //     data: JSON.stringify(info),
    //     success: function (account) {
    //         console.log('acc',account);
    //         setSalary(account)
    //         alert("Hire successfully!")
    //     }
    // });
}

function setSalary(account){
    console.log('accww',account);
    $.ajax({
        url: `api/accounts/${state.user.id}/${account.id}/salarys`,
        method: 'POST',
        success: function (ccount) {
            console.log('setsalary',ccount);
        }
    });
}

function search() {
    var email=$("#searchContent").val().trim();
    $.ajax({
        url:'api/accounts'+"/"+email,
        method: "GET",
        success:function(data){
            if(data){
                alert ("Find")
                createUpdateTable(data);
                console.log(data)
            }else {
                alert("No Such guy!")
            }
        },
        error:function () {

        }

    })
}

function createUpdateTable(data) {
$("#searchResults").append('')
}



function logout(evt) {
    $.ajax({
        url: '/logout',
        method: 'POST',
        success: function () {
            setUser(null);
        },
        error:function () {
            alert('error!!');
        }
    });
}
function retrieveEmployee(){
    $.ajax({
        url : 'api/accounts',
        method:'GET',
        success: updateEmployeeTable
    });
}

function updateEmployeeTable(results){
    var table = $('#account_table').empty();
    var props = ['id','email', 'name','phone','address'];
    // make header
    makeRow( 'th', props ).appendTo( table );

    results.forEach( result => {
        var tr = makeRow( 'td', props.map( p => result[p] ) );
        tr.click((event) => showModal(result));
        tr.appendTo(table);
        result.row = tr;
    } );
}

function showModal(account){
    state.modal.account = account;
    if(account) {
        console.log('accout',account);
        $('#emailmodal').text(account.email);
        $('#namemodal').text(account.name.first + " " + account.name.last);
        $('#titlemodal').text(account.title);
        $('#phoneModal').val(account.phone);
        $('#addressModal').val(account.address);
        $('#basic_salaryModal').val(account.basic_salary);
        $('#priorityModal').val(account.priority);
        $('#account_table').slideUp();
        $('#accountModal').slideDown();
        $('#salaryModal').slideDown();
    }else{
        $('#account_table').slideDown();
        $('#accountModal').slideUp();
        $('#salaryModal').slideUp();
    }
}

function cancel() {
    showModal(null);
}


function updateTable( salary ) {
    var table = $('#table').empty();
    var props = ['Time','Basic Salary', 'Reward','Deduction','Tax','Final Salary' ];
    var propOfData=['time','basic_salary', 'reward','deduction','tax','final' ];

    // make header
    makeRow( 'th', props ).appendTo( table );

    salary.forEach( singleSalary => {
        var tr = makeRow( 'td', propOfData.map( p => singleSalary[p] ) );
        tr.appendTo(table);
        singleSalary.row = tr;
    } );
};

function makeRow( type, values ) {
    return $(`<tr><${type}>` + values.join(`</${type}><${type}>`) + `</${type}></${type}>` );
}







