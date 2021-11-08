//Add new post page
$(document).on('pagebeforeshow', '#page-add-post', function () {
    prepareForm('#page-add-post #form-add-post');
});

$(document).on('change', '#page-add-post #form-add-post #select-city', function () {
    addAddressOption_District($('#page-add-post #form-add-post #select-district'), this.value);
    addAddressOption_Ward($('#page-add-post #form-add-post #select-ward'), -1);
});

$(document).on('change', '#page-add-post #form-add-post #select-district', function () {
    addAddressOption_Ward($('#page-add-post #form-add-post #select-ward'), this.value);
});

$(document).on('submit', '#page-add-post #form-add-post', confirmPost);

$(document).on('submit', '#page-add-post #form-confirm', addPost);

$(document).on('vclick', '#page-add-post #form-confirm #edit', function () {
    $('#page-add-post #form-confirm').popup('close');
});

function prepareForm(form) {
    addAddressOption($(`${form} #select-city`), 'City');
    addAddressOption_District($(`${form} #select-district`), -1);
    addAddressOption_Ward($(`${form} #select-ward`), -1);

    addOption($(`${form} #select-type`), Type, 'Type');
    addOption($(`${form} #select-furniture`), Furniture, 'Furniture');
}

function addAddressOption_District(select, selectedId, selectedValue = -1) {
    addAddressOption(select, 'District', selectedValue, `WHERE CityId = ${selectedId}`);
}

function addAddressOption_Ward(select, selectedId, selectedValue = -1) {
    addAddressOption(select, 'Ward', selectedValue, `WHERE DistrictId = ${selectedId}`);
}

function addAddressOption(select, name, selectedValue = -1, condition = '') {
    db.transaction(function (tx) {
        var query = `SELECT * FROM ${name} ${condition} ORDER BY Name`;
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Get list of ${name} successfully.`);

            var optionList = `<option value="-1">Select ${name}</option>`;

            for (let item of result.rows) {
                optionList += `<option value="${item.Id}" ${item.Id == selectedValue ? 'selected' : ''}>${item.Name}</option>`;
            }

            select.html(optionList);
            select.selectmenu('refresh', true);
        }
    });
}

function addOption(select, list, name, selectedValue = -1) {
    var optionList = `<option value="-1">Select ${name}</option>`;

    for (var key in list) {
        optionList += `<option value="${list[key]}" ${list[key] == selectedValue ? 'selected' : ''}>${key}</option>`;
    }

    select.html(optionList);
    select.selectmenu('refresh', true);
}

const Type = Object.freeze({
    "Apartment": 0,
    "Penthouse": 1,
    "House": 2,
    "Villa": 3
});

const Furniture = Object.freeze({
    "Unfurnished": 0,
    "Half Furnished": 1,
    "Furnished": 2
});

function isValid(form) {
    var isValid = true;

    if ($(`${form} #post-title`).val().length == 0) {
        isValid = false;
        $('#page-add-post #error').text("Post title is required.");
    }
    else if ($(`${form} #select-city`).val() == -1) {
        isValid = false;
        $('#page-add-post #error').text("City is required.");
    }
    else if ($(`${form} #select-district`).val() == -1) {
        isValid = false;
        $('#page-add-post #error').text("District is required.");
    }
    else if ($(`${form} #select-ward`).val() == -1) {
        isValid = false;
        $('#page-add-post #error').text("Ward is required.");
    }
    else if ($(`${form} #street`).val().length == 0) {
        isValid = false;
        $('#page-add-post #error').text("Street is required.");
    }
    else if ($(`${form} #select-type`).val() == -1) {
        isValid = false;
        $('#page-add-post #error').text("Type is required.");
    }
    else if ($(`${form} #select-furniture`).val() == -1) {
        isValid = false;
        $('#page-add-post #error').text("Furniture is required.");
    }
    else if ($(`${form} #number-room`).val().length == 0) {
        isValid = false;
        $('#page-add-post #error').text("Number of room is required.");
    }
    else if ($(`${form} #monthly-price`).val().length == 0) {
        isValid = false;
        $('#page-add-post #error').text("MonthLy price is required.");
    }
    else if ($(`${form} #contact-name`).val().length == 0) {
        isValid = false;
        $('#page-add-post #error').text("Contact name is required.");
    }
    else if ($(`${form} #contact-number`).val().length == 0) {
        isValid = false;
        $('#page-add-post #error').text("Contact Number is required.");
    }
    return isValid;
}

function confirmPost(e) {
    e.preventDefault();

    if (isValid('#page-add-post #form-add-post')) {
        var info = getFormInfoByName('#page-add-post #form-add-post', true);

        setHTMLInfo('#page-add-post #form-confirm', info, true);

        $('#page-add-post #form-confirm').popup('open');
    }
}

function getFormInfoByName(form) {
    var info = {
        'PostTitle': $(`${form} #post-title`).val(),
        'City': $(`${form} #select-city option:selected`).text(),
        'District': $(`${form} #select-district option:selected`).text(),
        'Ward': $(`${form} #select-ward option:selected`).text(),
        'Street': $(`${form} #street`).val(),
        'HouseType': $(`${form} #select-type option:selected`).text(),
        'HouseFurniture': $(`${form} #select-furniture option:selected`).text(),
        'NumberRoom': $(`${form} #number-room`).val(),
        'MonthlyPrice': $(`${form} #monthly-price`).val(),
        'ContactName': $(`${form} #contact-name`).val(),
        'ContactNumber': $(`${form} #contact-number`).val()
    };

    return info;
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

    if (isDate)
        $(`${form} #date`).text(info.DateAdded);
}

function addPost(e) {
    e.preventDefault();

    var info = getFormInfoByValue('#page-add-post #form-add-post');
    var userId = localStorage.getItem('userId', userId);

    db.transaction(function (tx) {
        var query = `INSERT INTO Post (PostTitle, City, District, Ward, Street, HouseType, HouseFurniture, NumberRoom, MonthlyPrice , ContactName, ContactNumber, DateAdded, AccountUser) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, julianday('now'), ?)`;
        tx.executeSql(query, [info.PostTitle, info.City, info.District, info.Ward, info.Street, info.HouseType, info.HouseFurniture, info.NumberRoom, info.MonthlyPrice, info.ContactName, info.ContactNumber, userId], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Create a post '${info.PostTitle}' successfully.`);

            $('#page-add-post #form-add-post').trigger('reset');
            $('#page-add-post #error').empty();
            $('#page-add-post #form-add-post #post-title').focus();

            $('#page-add-post #form-confirm').popup('close');
            addPostImage(result.insertId);

        }
    });
}

function getFormInfoByValue(form) {
    var info = {
        'PostTitle': $(`${form} #post-title`).val(),
        'City': $(`${form} #select-city`).val(),
        'District': $(`${form} #select-district`).val(),
        'Ward': $(`${form} #select-ward`).val(),
        'Street': $(`${form} #street`).val(),
        'HouseType': $(`${form} #select-type`).val(),
        'HouseFurniture': $(`${form} #select-furniture`).val(),
        'NumberRoom': $(`${form} #number-room`).val(),
        'MonthlyPrice': $(`${form} #monthly-price`).val(),
        'ContactName': $(`${form} #contact-name`).val(),
        'ContactNumber': $(`${form} #contact-number`).val()
    };

    return info;
}

function addPostImage(PostId) {
    db.transaction(function (tx) {
        var image = $('#page-add-post #img-preview #gallery img');
        var query = 'INSERT INTO PostImage (Image, PostId) VALUES (?, ?)';

        for (var i = 0; i < image.length; i++) {
            var src = image[i].src;
            tx.executeSql(query, [src.substring(23, src.length), PostId], transactionSuccess, transactionError);
        }

        function transactionSuccess(tx, result) {
            log(`Add post image for post '${PostId}' successfully.`);
        }

        $('#page-add-post #img-preview').css('display', 'none');
        $('#page-add-post #gallery').empty();
        $('#page-add-post #form-add-post').trigger('reset');
    });
}