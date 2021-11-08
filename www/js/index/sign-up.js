/* Sign up page */
/* Sign up submit */
$(document).on('submit','#page-register #form-register', function(e) {
    e.preventDefault();

    // Get user's input.
    var username = $('#page-register #form-register #register-username').val();
    var email = $('#page-register #form-register #register-email').val();
    var password = $('#page-register #form-register #register-password').val();
    var confirm_password = $('#page-register #form-register #confirm-password').val();

    var object = {
        username: username,
        email: email,
        password: password,
        confirm_password: confirm_password
    }

    registerValidate(object);
});

/* Sign up validate */
function registerValidate(object) {
    var username = object.username;
    var email = object.email;
    var password = object.password;
    var confirm_password = object.confirm_password;

    usernameCheck(username);
    emailCheck(email);
    var emailVal = emailValidate(email).toString();

    if(username.length == 0) {
        $('#page-register #form-register #error').text("Username is required.");
    }
    else if (username.length != 0 && username.length < 4) {
        $('#page-register #form-register #error').text("The username has min is 4.");
    }
    else if (username.length > 17) {
        $('#page-register #form-register #error').text("The username has max is 16.");
    }
    else if (email.length == 0) {
        $('#page-register #form-register #error').text("Email is required.");
    }
    else if (email.length != 0 && emailVal.length == 5) {
        $('#page-register #form-register #error').text("The email have wrong format.");
    }
    else if (password.length == 0) {
        $('#page-register #form-register #error').text("Password is required.");
    }
    else if (password.length != 0 && password.length < 4) {
        $('#page-register #form-register #error').text("The password has min is 4.");
    }
    else if (password.length > 17) {
        $('#page-register #form-register #error').text("The password has max is 16.");
    }
    else if (confirm_password.length == 0) {
        $('#page-register #form-register #error').text("Please input confirm password.");
    }
    else if (password != confirm_password) {
        $('#page-register #form-register #error').text("Password is mismatch.");
    }
    else {
        saveAccount(object);
    }
}

/* Check exist username */
function usernameCheck(username) {
    db.transaction(function (tx) {
        var query = 'SELECT Username FROM Account WHERE Username = ?';
        tx.executeSql(query, [username], transactionSuccess, transactionError);
        function transactionSuccess(tx, result) {
            if(result.rows[0] != null) {
                $('#page-register #error').text("This username " + username + " has existed!");
            }
        }
    });
}

/* Validate email */
function emailValidate(email) {
    var emailFormat =  /^[a-zA-Z0-9.!#$%&*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;;
    var check = emailFormat.test(email);
    return check;
}

/* Check exist email */
function emailCheck(email) {
    db.transaction(function (tx) {
        var query = 'SELECT Email FROM Account WHERE Email = ?';
        tx.executeSql(query, [email], transactionSuccess, transactionError);
        function transactionSuccess(tx, result) {
            if(result.rows[0] != null) {
                $('#page-register #error').text("This email " + email + " has been used!");
            }
        }
    });
}

/* Sign up save to database */
function saveAccount(object) {

    db.transaction(function (tx) {
        var query = 'INSERT INTO Account (Username, Email, Password) VALUES (?, ?, ?)';
        tx.executeSql(query, [object.username, object.email, object.password], transactionSuccess, transactionError);
        function transactionSuccess(tx, result) {
            // Logging.
            $.mobile.navigate('#page-home', { transition: 'none' });
            localStorage.setItem('username', object.username);
            setAuthentication(object.username);
        }
    });
}