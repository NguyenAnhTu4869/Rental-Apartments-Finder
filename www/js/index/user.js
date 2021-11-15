//My post list page
$(document).on('vclick', '#page-user #user #post-list', function () {
    $.mobile.navigate('#page-list-post', { transition: 'none' });
});

$(document).on('pagebeforeshow', '#page-list-post', showUserList);

$(document).on('vclick', '#page-list-post #my-post-list li a', navigatePageDetail);

$(document).on('vclick', '#page-user #user #about-me', function () {
    $.mobile.navigate('#page-about', { transition: 'none' });
});

$(document).on('vclick', '#page-user #user #user-info', function () {
    $.mobile.navigate('#page-coming-soon', { transition: 'none' });
});

$(document).on('vclick', '#page-user #user #vibration', function () {
    navigator.vibrate([1000, 1000, 3000, 1000, 5000]);
});

$(document).on('vclick', '#page-user #user #notification', function () {
    navigator.notification.beep(5);
});


function showUserList() {
    var userId = localStorage.getItem('userId');
    log(userId);
    db.transaction(function (tx) {
        var query = `SELECT Post.Id AS Id, Post.PostTitle AS PostTitle, MonthlyPrice, NumberRoom, HouseType, City.Name AS City
                     FROM Post LEFT JOIN City ON Post.City = City.Id
                     WHERE AccountUser = ?`;

        tx.executeSql(query, [userId], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Get list of posts successfully.`);
            displayMyList(result.rows);
        }
    });
}

function displayMyList(list) {
    var postList = `<ul id='my-post-list' data-role='listview' class='ui-nodisc-icon ui-alt-icon'>`;

    postList += list.length == 0 ? '<li><h2>There is no post.</h2></li>' : '';

    for (let post of list) {
        postList +=
            `<li>
                <a data-details='{"Id" : ${post.Id}}' style='padding-left: 25px; margin-bottom: 10px;'>
                    <h2 style='margin-bottom: 0px;'>${post.PostTitle}</h2>
                    <p style='margin-top: 2px; margin-bottom: 10px;'><small>${post.City}</small></p>

                    <div>
                        <img src='img/icon-room.png' height='20px' style='margin-bottom: -5px;'>
                        <strong style='font-size: 13px;'>${post.NumberRoom}</strong>

                        &nbsp;&nbsp;

                        <img src='img/icon-house.png' height='21px' style='margin-bottom: -5px;'>
                        <strong style='font-size: 13px;'>${Object.keys(Type)[post.HouseType]}</strong>

                        &nbsp;&nbsp;

                        <img src='img/icon-price.png' height='20px' style='margin-bottom: -3px;'>
                        <strong style='font-size: 13px;'>${post.MonthlyPrice.toLocaleString('en-US')} VNĐ/month</strong>
                    </div>
                </a>
            </li>`;
    }
    postList += `</ul>`;

    $('#my-post-list').empty().append(postList).listview('refresh').trigger('create');

    log(`Show list of posts successfully.`);
}

