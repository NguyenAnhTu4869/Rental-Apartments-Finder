//Sign in page
//Sign in submit
$(document).on('submit','#page-login #form-login', function(e) {
    e.preventDefault();

    // Get user's input.
    var username = $('#page-login #form-login #login-username').val();
    var password = $('#page-login #form-login #login-password').val();
    var object = {
        username: username,
        password: password
    }

    loginValidate(object);
});

/* Sign in validate */
function loginValidate(object) {
    var username = object.username;
    var password = object.password;

    if(username.length == 0) {
        $('#page-login #error').text("Username is required.");
    } else if (password.length == 0) {
        $('#page-login #error').text("Password is required.");
    } else {
        login(object);
    }
}

/* Sign in */
function login(object) {
    var username = object.username;
    var password = object.password;

    db.transaction(function (tx) {
        var query = 'SELECT Username FROM Account WHERE Username = ? OR Email = ?';
        tx.executeSql(query, [username, username], transactionSuccess, transactionError);
        function transactionSuccess(tx, result) {
            if(result.rows[0] == null) {
                $('#page-login #error').text("This username haven't existed!");
            } else {
                var query = 'SELECT Password FROM Account WHERE Username = ? OR Email = ?';
                tx.executeSql(query, [username, username], transactionSuccess, transactionError);
                function transactionSuccess(tx, result) {
                    var account_password = result.rows[0].Password;
                    if(password != account_password){
                        $('#page-login #error').text("This password is wrong!");
                    }else {
                        //login
                        $.mobile.navigate('#page-home', { transition: 'none' });
                        localStorage.setItem('username', username);
                        setAuthentication(username);
                    }
                }
            }
        }
    });
}

/* Log out */
$(document).on('vclick', '#btn-logout', function (e) {
    e.preventDefault();
    delete localStorage.username;
    delete localStorage.userId;
    delete localStorage.currentPostId;
    $.mobile.navigate('#page-login', { transition: 'none' });
});