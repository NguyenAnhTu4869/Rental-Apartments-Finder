$(document).on('pagebeforeshow', '#page-detail', function(){
    showDetail();
    checkCurrentUser();
    $('#page-detail #note').css('display', 'none');
});

function showDetail() {
    var id = localStorage.getItem('currentPostId');

    db.transaction(function (tx) {
        var query = `SELECT Post.*, datetime(Post.DateAdded, '+7 hours') AS DateAddedConverted, City.Name AS CityName, District.Name AS DistrictName, Ward.Name AS WardName, Account.Username AS AccountUsername
                     FROM Post
                     LEFT JOIN City ON City.Id = Post.City
                     LEFT JOIN District ON District.Id = Post.District
                     LEFT JOIN Ward ON Ward.Id = Post.Ward
                     LEFT jOIN Account ON Account.Id = Post.AccountUser
                     WHERE Post.Id = ?`;

        tx.executeSql(query, [id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            if (result.rows[0] != null) {
                log(`Get details of post '${result.rows[0].PostTitle}' successfully.`);

                var info = {
                    'PostTitle': result.rows[0].PostTitle,
                    'Street': result.rows[0].Street,
                    'City': result.rows[0].CityName,
                    'District': result.rows[0].DistrictName,
                    'Ward': result.rows[0].WardName,
                    'HouseType': Object.keys(Type)[result.rows[0].HouseType],
                    'HouseFurniture': Object.keys(Furniture)[result.rows[0].HouseFurniture],
                    'NumberRoom': result.rows[0].NumberRoom,
                    'MonthlyPrice': result.rows[0].MonthlyPrice,
                    'ContactName': result.rows[0].ContactName,
                    'ContactNumber': result.rows[0].ContactNumber,
                    'DateAdded': result.rows[0].DateAddedConverted,
                    'AccountUser': result.rows[0].AccountUsername
                };

                setHTMLInfo('#page-detail', info, true);
                appendPostImage(id);
            }
            else {
                var errorMessage = 'Post not found.';

                log(errorMessage, ERROR);

                $('#page-detail #post-title').text(errorMessage);
                $('#page-detail #btn-update').addClass('ui-disabled');
                $('#page-detail #btn-delete-confirm').addClass('ui-disabled');
            }
        }
    });
}

function setHTMLInfo(form, info, isDate = false) {
    $(`${form} #post-title`).text(info.PostTitle);
    $(`${form} #street`).text(info.Street);
    $(`${form} #city`).text(info.City);
    $(`${form} #district`).text(info.District);
    $(`${form} #ward`).text(info.Ward);
    $(`${form} #house-type`).text(info.HouseType);
    $(`${form} #house-furniture`).text(info.HouseFurniture);
    $(`${form} #number-room`).text(info.NumberRoom);
    $(`${form} #monthly-price`).text(`${info.MonthlyPrice.toLocaleString('en-US')} VNĐ / month`);
    $(`${form} #contact-name`).text(info.ContactName);
    $(`${form} #contact-number`).text(info.ContactNumber);
    $(`${form} #reporter`).text(info.AccountUser);

    if (isDate)
        $(`${form} #date`).text(info.DateAdded);
}

function appendPostImage(PostId) {
    $('#page-detail #post-img #gallery').empty();
    $('#page-detail #form-update #img-preview #gallery').empty();
    db.transaction(function (tx) {
        query = 'SELECT Image FROM PostImage WHERE PostId = ?';

        tx.executeSql(query, [PostId], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var imageList = '';
            for (let image of result.rows)
                imageList += `<img src='data:image/jpeg;base64,${image.Image}'>`;

            $(`#page-detail #post-img #gallery`).append(imageList);
            $(`#page-detail #form-update #img-preview #gallery`).append(imageList);
        }
    });
}

function checkCurrentUser() {
    var userId = localStorage.getItem('userId');
    var id = localStorage.getItem('currentPostId');

    db.transaction(function (tx) {
        var query = `SELECT Post.AccountUser FROM Post WHERE Post.Id = ?`;
        tx.executeSql(query, [id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            if (userId == result.rows[0].AccountUser){
                $('#page-detail .btn-option').css('display', 'block');
            } else {
                $('#page-detail .btn-option').css('display', 'none');
            }

        }
    });
}

$(document).on('vclick', '#page-detail #btn-update-popup', showUpdate);
$(document).on('submit', '#page-detail #form-update', updatePost);
$(document).on('vclick', '#page-detail #form-update #cancel', function () {
    $('#page-detail #form-update').popup('close');
});

function showUpdate() {
    var id = localStorage.getItem('currentPostId');
    appendPostImage(id);

    db.transaction(function (tx) {
        var query = `SELECT * FROM Post WHERE Id = ?`;

        tx.executeSql(query, [id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            if (result.rows[0] != null) {
                log(`Get details of post '${result.rows[0].PostTitle}' successfully.`);

                $(`#page-detail #form-update #post-title`).val(result.rows[0].PostTitle);
                $(`#page-detail #form-update #street`).val(result.rows[0].Street);
                $(`#page-detail #form-update #number-room`).val(result.rows[0].NumberRoom);
                $(`#page-detail #form-update #monthly-price`).val(result.rows[0].MonthlyPrice);
                $(`#page-detail #form-update #contact-name`).val(result.rows[0].ContactName);
                $(`#page-detail #form-update #contact-number`).val(result.rows[0].ContactNumber);

                addAddressOption($('#page-detail #form-update #select-city'), 'City', result.rows[0].City);
                addAddressOption_District($('#page-detail #form-update #select-district'), result.rows[0].City, result.rows[0].District);
                addAddressOption_Ward($('#page-detail #form-update #select-ward'), result.rows[0].District, result.rows[0].Ward);

                addOption($('#page-detail #form-update #select-type'), Type, 'HouseType', result.rows[0].HouseType);
                addOption($('#page-detail #form-update #select-furniture'), Furniture, 'HouseFurniture', result.rows[0].HouseFurniture);

                changePopup($('#page-detail #option'), $('#page-detail #form-update'));
            }
        }
    });
}

function updatePost(e) {
    e.preventDefault();

    if (isValid('#page-detail #form-update')) {
        var id = localStorage.getItem('currentPostId');
        var info = getFormInfoByValue('#page-detail #form-update', false);

        db.transaction(function (tx) {
            var query = `UPDATE Post
                         SET PostTitle = ?,
                             City = ?, District = ?, Ward = ?, Street = ?,
                             HouseType = ?, HouseFurniture = ?, NumberRoom = ?, MonthlyPrice = ?,
                             ContactName = ?, ContactNumber = ?,
                             DateAdded = julianday('now')
                         WHERE Id = ?`;

            tx.executeSql(query, [info.PostTitle, info.City, info.District, info.Ward, info.Street, info.HouseType, info.HouseFurniture, info.NumberRoom, info.MonthlyPrice, info.ContactName, info.ContactNumber, id], transactionSuccess, transactionError);

            function transactionSuccess(tx, result) {
                log(`Update post '${info.PostTitle}' successfully.`);
                updatePostImage(id);
                showDetail();
                $('#page-detail #form-update').popup('close');
            }
        });
    }
}

function updatePostImage(PostId) {
    db.transaction(function (tx) {
        var query = 'DELETE FROM PostImage WHERE PostId = ?';
        tx.executeSql(query, [PostId], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var image = $('#page-detail #img-preview #gallery img');
            var query = 'INSERT INTO PostImage (Image, PostId) VALUES (?, ?)';

            for (var i = 0; i < image.length; i++) {
                var src = image[i].src;
                tx.executeSql(query, [src.substring(23, src.length), PostId], transactionSuccess, transactionError);
            }

            function transactionSuccess(tx, result) {
                log(`Update post image for post '${PostId}' successfully.`);
            }

            $('#page-detail #img-preview').css('display', 'none');
            $('#page-detail #gallery').empty();
            $('#page-detail #form-update').trigger('reset');
        }
    });
}

function changePopup(sourcePopup, destinationPopup) {
    var afterClose = function () {
        destinationPopup.popup("open");
        sourcePopup.off("popupafterclose", afterClose);
    };

    sourcePopup.on("popupafterclose", afterClose);
    sourcePopup.popup("close");
}

$(document).on('vclick', '#page-detail #btn-delete-popup', function () {
    changePopup($('#page-detail #option'), $('#page-detail #form-delete'));
});
$(document).on('submit', '#page-detail #form-delete', deletePost);
$(document).on('change', '#page-detail #form-delete #check-confirm', confirmDeletePost);

function confirmDeletePost() {
    var confirm = $('#page-detail #form-delete #check-confirm').is(":checked");

    if (confirm == true) {
        $('#page-detail #form-delete #btn-delete').removeClass('ui-disabled');
    }
    else {
        $('#page-detail #form-delete #btn-delete').addClass('ui-disabled');
    }
}

function deletePost(e) {
    e.preventDefault();

    var id = localStorage.getItem('currentPostId');

    db.transaction(function (tx) {
        var query = 'DELETE FROM PostImage WHERE PostId = ?';
        tx.executeSql(query, [id], function (tx, result) {
            log(`Delete image of post '${id}' successfully.`);
        }, transactionError);

        var query = 'DELETE FROM Post WHERE Id = ?';
        tx.executeSql(query, [id], function (tx, result) {
            log(`Delete post '${id}' successfully.`);
        }, transactionError);
    });

    deleteAllNote(id);
}

function deleteAllNote(PostId){
    db.transaction(function (tx) {
        var query = `SELECT Id FROM PostNote
                     WHERE PostId = ?`;
        tx.executeSql(query, [PostId], transactionSuccess, transactionError);
        function transactionSuccess(tx, result) {
            for (let note of result.rows){
                var query = 'DELETE FROM NoteImage WHERE NoteId = ?';
                tx.executeSql(query, [note.Id], function (tx, result) {}, transactionError);
            }
        }

        var query = 'DELETE FROM PostNote WHERE PostId = ?';
        tx.executeSql(query, [PostId], function (tx, result) {}, transactionError);
    });

    $('#page-detail #form-delete').trigger('reset');
    $.mobile.navigate('#page-home', { transition: 'none' });
}