//List post home page
$(document).on('pagebeforeshow', '#page-home', showList);

$(document).on('vclick', '#page-home #list-post li a', navigatePageDetail);

function showList() {
    db.transaction(function (tx) {
        var query = `SELECT Post.Id AS Id, Post.PostTitle AS PostTitle, MonthlyPrice, NumberRoom, HouseType, City.Name AS City
                     FROM Post LEFT JOIN City ON Post.City = City.Id`;

        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Get list of posts successfully.`);
            displayList(result.rows);
        }
    });
}

function displayList(list) {
    var postList = `<ul id='list-post' data-role='listview' class='ui-nodisc-icon ui-alt-icon'>`;

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

    $('#list-post').empty().append(postList).listview('refresh').trigger('create');

    log(`Show list of posts successfully.`);
}

function navigatePageDetail(e) {
    e.preventDefault();

    var id = $(this).data('details').Id;
    localStorage.setItem('currentPostId', id);

    $.mobile.navigate('#page-detail', { transition: 'none' });
}