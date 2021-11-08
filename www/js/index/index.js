// Create or Open Database.
var db = window.openDatabase('RentalZ', '1.0', 'RentalZ', 20000);

// To detect whether users use mobile phones horizontally or vertically.
$(window).on('orientationchange', onOrientationChange);

function onOrientationChange(e) {
    if (e.orientation == 'portrait') {
        console.log('Portrait.');
    }
    else {
        console.log('Landscape.');
    }
}

// To detect whether users open applications on mobile phones or browsers.
if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
    $(document).on('deviceready', onDeviceReady);
}
else {
    onDeviceReady();
}

// Display messages in the console.
function log(message) {
    console.log(`[${new Date()}] ${message}`);
}

// Display errors when executing SQL queries.
function transactionError(tx, error) {
    console.log(`Errors when executing SQL query. [Code: ${error.code}] [Message: ${error.message}]`);
}

function transactionSuccessForTable(tableName) {
    log(`Create table '${tableName}' successfully.`);
}

function transactionSuccessForTableData(tableName, id, name) {
    log(`Insert (${id}, "${name}") into '${tableName}' successfully.`);
}

// Run this function after starting the application.
function onDeviceReady() {
    // Logging.
   console.log('Device is ready.');

    db.transaction(function (tx) {
        // Create TABLE 'Account'
        var query = `CREATE TABLE IF NOT EXISTS Account (
                     Id INTEGER PRIMARY KEY AUTOINCREMENT,
                     Username TEXT NOT NULL UNIQUE,
                     Email TEXT NOT NULL UNIQUE,
                     Password TEXT NOT NULL)`;

        tx.executeSql(query, [], transactionSuccessForTable('Account'), transactionError);

        // Create TABLE 'Post'
        query = `CREATE TABLE IF NOT EXISTS Post (
                 Id INTEGER PRIMARY KEY AUTOINCREMENT,
                 PostTitle TEXT NOT NULL,
                 City INTEGER NOT NULL,
                 District INTEGER NOT NULL,
                 Ward INTEGER NOT NULL,
                 Street TEXT NOT NULL,
                 HouseType INTEGER NOT NULL,
                 HouseFurniture INTEGER NULL,
                 NumberRoom INTEGER NOT NULL,
                 MonthlyPrice REAL NOT NULL,
                 ContactName TEXT NOT NULL,
                 ContactNumber TEXT NOT NULL,
                 DateAdded REAL NOT NULL,
                 AccountUser INTEGER NOT NULL,
                 FOREIGN KEY (AccountUser) REFERENCES Account(Id) ON DELETE CASCADE
        )`;

        tx.executeSql(query, [], transactionSuccessForTable('Post'), transactionError);

        // Create table Post image.
        query = `CREATE TABLE IF NOT EXISTS PostImage (
                 Id INTEGER PRIMARY KEY AUTOINCREMENT,
                 Image BLOB,
                 PostId INTEGER NOT NULL,
                 FOREIGN KEY (PostId) REFERENCES Post(Id) ON DELETE CASCADE
        )`;

        tx.executeSql(query, [], transactionSuccessForTable('Post Image'), transactionError);

        // Create table Post note.
        query = `CREATE TABLE IF NOT EXISTS PostNote (
                 Id INTEGER PRIMARY KEY AUTOINCREMENT,
                 Message TEXT NOT NULL,
                 DateAdded REAL NOT NULL,
                 PostId INTEGER NOT NULL,
                 AccountId INTEGER NOT NULL,
                 FOREIGN KEY (PostId) REFERENCES Post(Id) ON DELETE CASCADE,
                 FOREIGN KEY (AccountId) REFERENCES Account(Id) ON DELETE CASCADE
        )`;

        tx.executeSql(query, [], transactionSuccessForTable('Post note'), transactionError);

        // Create table NOTE IMAGE.
        query = `CREATE TABLE IF NOT EXISTS NoteImage (
                 Id INTEGER PRIMARY KEY AUTOINCREMENT,
                 Image BLOB,
                 NoteId INTEGER NOT NULL,
                 FOREIGN KEY (NoteId) REFERENCES PostNote(Id) ON DELETE CASCADE
        )`;

        tx.executeSql(query, [], transactionSuccessForTable('Note image'), transactionError);
    });

    prepareDatabase(db);
}


function changePopup(sourcePopup, destinationPopup) {
    var afterClose = function () {
        destinationPopup.popup("open");
        sourcePopup.off("popupafterclose", afterClose);
    };

    sourcePopup.on("popupafterclose", afterClose);
    sourcePopup.popup("close");
}

function setAuthentication(username) {
    db.transaction(function (tx) {
        var query = 'SELECT Id FROM Account WHERE Username = ? OR Email = ?';
        tx.executeSql(query, [username, username], transactionSuccess, transactionError);
        function transactionSuccess(tx, result) {
            var userId = parseInt(result.rows[0].Id);
            localStorage.setItem('userId', userId);

            var query = 'SELECT Username FROM Account WHERE Id = ?';
            tx.executeSql(query, [userId], transactionSuccess, transactionError);
            function transactionSuccess(tx, result) {
                var username = result.rows[0].Username;
                localStorage.setItem('username', username);
                $("#username").text(username);
            }
        }
    });
}
