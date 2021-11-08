//Search post home page
$(document).on('keyup', $('#page-home #txt-filters'), filterPost);

$(document).on('vclick', '#page-home #btn-filter-popup', openFormSearch);

$(document).on('change', '#page-home #form-search #select-city', function () {
    addAddressOption_District($('#page-home #form-search #select-district'), this.value);
    addAddressOption_Ward($('#page-home #form-search #select-ward'), -1);
});

$(document).on('change', '#page-home #form-search #select-district', function () {
    addAddressOption_Ward($('#page-home #form-search #select-ward'), this.value);
});

$(document).on('submit', '#page-home #form-search', search);

$(document).on('vclick', '#page-home #btn-reset', function(){
    showList();
    $('#page-home #form-search').popup('close');
});

function filterPost() {
    var filter = $('#page-home #txt-filters').val().toLowerCase();
    var li = $('#page-home #list-post ul li');

    for (var i = 0; i < li.length; i++) {
        var a = li[i].getElementsByTagName("h2")[0];
        var text = a.textContent || a.innerText;

        li[i].style.display = text.toLowerCase().indexOf(filter) > -1 ? "" : "none";
    }
}

function openFormSearch(e) {
    e.preventDefault();
    prepareForm('#page-home #form-search');
    $('#page-home #form-search').popup('open');
}

function search(e) {
    e.preventDefault();

    var post_title = $('#page-home #form-search #post-title').val();
    var select_city = $('#page-home #form-search #select-city').val();
    var select_district = $('#page-home #form-search #select-district').val();
    var select_ward = $('#page-home #form-search #select-ward').val();
    var street = $('#page-home #form-search #street').val();
    var select_type = $('#page-home #form-search #select-type').val();
    var select_furniture = $('#page-home #form-search #select-furniture').val();
    var number_room = $('#page-home #form-search #number-room').val();
    var priceMin = $('#page-home #form-search #price-min').val();
    var priceMax = $('#page-home #form-search #price-max').val();
    var contact_name = $('#page-home #form-search #contact-name').val();
    var contact_number = $('#page-home #form-search #contact-number').val();

    db.transaction(function (tx) {
        var query = `SELECT Post.Id AS Id, Post.PostTitle AS PostTitle, MonthlyPrice, NumberRoom, HouseType, ContactName, ContactNumber, City.Name AS City
                     FROM Post LEFT JOIN City ON Post.City = City.Id
                     WHERE`;

        query += post_title ? ` Post.PostTitle LIKE "%${post_title}%"   AND` : '';
        query += select_city != -1 ? ` City = ${select_city}   AND` : '';
        query += select_district != -1 ? ` District = ${select_district}   AND` : '';
        query += select_ward != -1 ? ` Ward = ${select_ward}   AND` : '';
        query += street ? ` Street LIKE "%${street}%"   AND` : '';
        query += select_type != -1 ? ` HouseType = ${select_type}   AND` : '';
        query += select_furniture != -1 ? ` HouseFurniture = ${select_furniture}   AND` : '';
        query += number_room ? ` NumberRoom = ${number_room}   AND` : '';
        query += priceMin ? ` MonthlyPrice >= ${priceMin}   AND` : '';
        query += priceMax ? ` MonthlyPrice <= ${priceMax}   AND` : '';
        query += contact_name ? ` ContactName LIKE "%${contact_name}%"   AND` : '';
        query += contact_number ? ` ContactNumber LIKE "%${contact_number}%"   AND` : '';

        query = query.substring(0, query.length - 6);

        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Search post successfully.`);

            displayList(result.rows);

            $('#page-home #form-search').trigger('reset');
            $('#page-home #form-search').popup('close');
        }
    });
}