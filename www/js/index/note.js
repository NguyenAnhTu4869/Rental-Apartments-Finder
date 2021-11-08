$(document).on('vclick', '#page-detail #btn-toggle-note', function() {
    var noteDisplay = $('#page-detail #note').css('display');
    $('#page-detail #note').css('display', noteDisplay == 'none' ? 'block' : 'none');

    showNote();
});

$(document).on('submit', '#page-detail #note #form-add-note', addNote);

function addNote(e) {
    e.preventDefault();

    var id = localStorage.getItem('currentPostId');
    var userId = localStorage.getItem('userId');
    var message = $('#page-detail #note #form-add-note #message').val();

    if (message != '' || $('#page-detail #form-add-note #img-preview').css('display') != 'none') {
        db.transaction(function (tx) {
            var query = `INSERT INTO PostNote (Message, PostId, AccountId, DateAdded) VALUES (?, ?, ?, julianday('now'))`;
            tx.executeSql(query, [message, id, userId], transactionSuccess, transactionError);

            function transactionSuccess(tx, result) {
                log(`Add new note to post '${id}' successfully.`);
                log(result.insertId);
                addNoteImage(result.insertId);
                showNote();
            }
        });
    }
}

function addNoteImage(NoteId) {
    db.transaction(function (tx) {
        var image = $('#page-detail #form-add-note #img-preview #gallery img');
        var query = 'INSERT INTO NoteImage (Image, NoteId) VALUES (?, ?)';

        for (var i = 0; i < image.length; i++) {
            var src = image[i].src;
            tx.executeSql(query, [src.substring(23, src.length), NoteId], transactionSuccess, transactionError);
        }

        function transactionSuccess(tx, result) {
            log(`Add post image for post '${NoteId}' successfully.`);
        }

        $('#page-detail #form-add-note #img-preview').css('display', 'none');
        $('#page-detail #form-add-note #gallery').empty();
        $('#page-detail #note #form-add-note').trigger('reset');
    });
}

function showNote() {
    var id = localStorage.getItem('currentPostId');
    var userId = localStorage.getItem('userId');

    db.transaction(function (tx) {
        var query = `SELECT PostNote.*, datetime(DateAdded, '+7 hours') AS DateAdded, Account.Username AS AccountUser
                     FROM PostNote
                     LEFT jOIN Account ON Account.Id = PostNote.AccountId
                     WHERE PostId = ?
                     ORDER BY DateAdded DESC`;

        tx.executeSql(query, [id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Get list of notes successfully.`);

            var noteList = '';
            for (let note of result.rows) {
                noteList += `
                    <div class='list' id='note-${note.Id}' data-details='{"Id" : ${note.Id}}'>
                        <table style='white-space: nowrap;'>
                            <tr>
                                <th rowspan='2'><img src='./img/avatar.png' class='avatar'></th>
                                <td style='width: 100%; padding-left: 10px;'><strong>${note.AccountUser}</strong></td>
                                <td style='text-align: right; vertical-align: top;' rowspan='2' class='setting'>`;
                    if(userId == note.AccountId) {
                        noteList += `
                            <a id='btn-update-note' data-details='{"Id" : ${note.Id}, "Message" : "${note.Message}"}' style='font-size: 10px;'
                                class='ui-btn ui-icon-edit ui-alt-icon ui-btn-icon-notext ui-nodisc-icon ui-btn-inline ui-mini transparent'></a>

                            <a id='btn-delete-note' data-details='{"Id" : ${note.Id}, "Message" : "${note.Message}"}' style='font-size: 10px; margin-left: 5px;'
                                data-rel='popup' data-position-to='window'
                                class='ui-btn ui-icon-delete ui-alt-icon ui-btn-icon-notext ui-nodisc-icon ui-btn-inline ui-mini transparent'></a>
                    `;}
                    noteList += `
                                </td>
                            </tr>

                            <tr>
                                <td style='padding-left: 10px;'><small>${note.DateAdded}</small></td>
                            </tr>
                        </table>

                        <p style='padding-left: 8px; font-size: 16px;' id='message-${note.Id}'>${note.Message}</p>

                        <div class='image' id='image-${note.Id}' style='overflow-x: scroll; white-space: nowrap;'></div>
                    </div>`;

                appendNoteImage(note.Id);
            }

            $('#page-detail #note #list').empty().append(noteList);

            log(`Show list of comments successfully.`);
        }
    });
}

function appendNoteImage(NoteId) {
    db.transaction(function (tx) {
        query = 'SELECT Image FROM NoteImage WHERE NoteId = ?';

        tx.executeSql(query, [NoteId], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var imageList = '';
            for (let image of result.rows)
                imageList += `<img src='data:image/jpeg;base64,${image.Image}'>`;

            $(`#page-detail #note #list #image-${NoteId}`).append(imageList);
        }
    });
}

$(document).on('vclick', '#page-detail #note #list #btn-update-note', updateNoteConfirm);
$(document).on('submit', '#page-detail #note #form-update-note', updateNote);
$(document).on('reset', '#page-detail #note #form-update-note', resetNote);

function updateNoteConfirm(e) {
    e.preventDefault();
    var data = $(this).data('details');

    $(`#page-detail #note #list #note-${data.Id} #message-${data.Id}`).html(`
        <form id='form-update-note' data-details='{"Id" : ${data.Id}}'>
            <table>
                <tr>
                    <td style='width: 100%; padding-right: 5px;'>
                        <textarea id='message' name='message' rows='3' style='width: 95%;'>${data.Message}</textarea>
                    </td>

                    <td class='button'>
                        <button type='submit' class='ui-btn ui-icon-check ui-corner-all ui-btn-icon-notext ui-nodisc-icon ui-btn-inline ui-mini' style='margin: 0 8px 5px 8px;'></button>
                        <button type='reset' class='ui-btn ui-icon-delete ui-corner-all ui-btn-icon-notext ui-nodisc-icon ui-btn-inline ui-mini' style='margin: 5px 8px 0 8px;'></button>
                    </td>
                </tr>
            </table>
        </form>
    `);
}

function updateNote(e) {
    e.preventDefault();

    var id = $(this).data('details').Id;
    var message = $(`#page-detail #note #list #note-${id} #message-${id} #message`).val();

    db.transaction(function (tx) {
        var query = `UPDATE PostNote SET Message = ? WHERE Id = ?`;

        tx.executeSql(query, [message, id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Update comment '${id}' successfully.`);

            $(`#page-detail #note #list #note-${id} #message-${id}`).text(message);
            showNote();
        }
    });
}

function resetNote(e) {
    e.preventDefault();

    var id = $(this).data('details').Id;
    var message = $(`#page-detail #note #list #note-${id} #message-${id} #message`).text();

    $(`#page-detail #note #list #note-${id} #message-${id}`).text(message);
}

$(document).on('vclick', '#page-detail #note #list .setting #btn-delete-note', deleteNoteConfirm);
$(document).on('submit', '#page-detail #form-delete-note', deleteNote);

function deleteNoteConfirm(e) {
    e.preventDefault();

    var data = $(this).data('details');

    $('#page-detail #form-delete-note #id').text(data.Id);
    $('#page-detail #form-delete-note #message').text(`Message: "${data.Message}"`);

    $('#page-detail #form-delete-note').popup('open');
}

function deleteNote(e) {
    e.preventDefault();

    var noteId = $('#page-detail #form-delete-note #id').text();

    db.transaction(function (tx) {
        var query = `DELETE FROM PostNote WHERE Id = ?`;
        tx.executeSql(query, [noteId], function(tx, result) {
            log(`Delete comment '${noteId}' successfully.`);
        }, transactionError);

        var query = `DELETE FROM NoteImage WHERE NoteId = ?`;
        tx.executeSql(query, [noteId], function(tx, result){
            log(`Delete images of comment '${noteId}' successfully.`);
            $('#page-detail #form-delete-note #id').text('');
            $('#page-detail #form-delete-note #message').text('');
            $('#page-detail #form-delete-note').popup('close');
            $(`#page-detail #note #list #note-${noteId}`).remove();
        }, transactionError);
    });
}

