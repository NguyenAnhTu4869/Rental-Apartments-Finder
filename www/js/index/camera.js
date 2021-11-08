//Camera add post
$(document).on('vclick', '#page-add-post #form-add-post #btn-gallery', function () {
    getImage(true, Camera.PictureSourceType.PHOTOLIBRARY);
});

$(document).on('vclick', '#page-add-post #form-add-post #btn-camera', function () {
    getImage(true, Camera.PictureSourceType.CAMERA);
});

$(document).on('vclick', '#page-add-post #form-add-post #img-preview #btn-close', function () {
    $('#page-add-post #form-add-post #img-preview').css('display', 'none');
    $('#page-add-post #form-add-post #img-preview #gallery').empty();
});

function getImage(saveToPhotoAlbum, sourceType) {
    var options = {
        destinationType: Camera.DestinationType.DATA_URL,
        saveToPhotoAlbum: saveToPhotoAlbum,
        sourceType: sourceType
    };

    navigator.camera.getPicture(success, error, options);

    function success(imageData) {
        var display = $('#page-add-post #img-preview').css('display');

        if (display == 'none') {
            $('#page-add-post #img-preview #gallery').empty();
            $('#page-add-post #img-preview').css('display', 'block');
        }

        $('#page-add-post #img-preview #gallery').append(`<img src='data:image/jpeg;base64,${imageData}'>`);
        $('#page-add-post #form-confirm #gallery').append(`<img src='data:image/jpeg;base64,${imageData}'>`);

    }

    function error(error) {
        alert(`Failed to get picture. Error: ${error}.`);
    }
}

//Camera update post
$(document).on('vclick', '#page-detail #form-update #btn-gallery', function () {
    getUpdateImage(true, Camera.PictureSourceType.PHOTOLIBRARY);
});

$(document).on('vclick', '#page-detail #form-update #btn-camera', function () {
    getUpdateImage(true, Camera.PictureSourceType.CAMERA);
});

$(document).on('vclick', '#page-detail #form-update #img-preview #btn-close', function () {
    $('#page-detail #form-update #img-preview').css('display', 'none');
    $('#page-detail #form-update #img-preview #gallery').empty();
});

function getUpdateImage(saveToPhotoAlbum, sourceType) {
    var options = {
        destinationType: Camera.DestinationType.DATA_URL,
        saveToPhotoAlbum: saveToPhotoAlbum,
        sourceType: sourceType
    };

    navigator.camera.getPicture(success, error, options);

    function success(imageData) {
        var display = $('#page-detail #form-update #img-preview').css('display');

        if (display == 'none') {
            $('#page-detail #form-update #img-preview #gallery').empty();
            $('#page-detail #form-update #img-preview').css('display', 'block');
        }

        $('#page-detail #form-update #img-preview #gallery').append(`<img src='data:image/jpeg;base64,${imageData}'>`);

    }

    function error(error) {
        alert(`Failed to get picture. Error: ${error}.`);
    }
}

//Camera note
$(document).on('vclick', '#page-detail #form-add-note #btn-gallery', function () {
    getNoteImage(true, Camera.PictureSourceType.PHOTOLIBRARY);
});

$(document).on('vclick', '#page-detail #form-add-note #btn-camera', function () {
    getNoteImage(true, Camera.PictureSourceType.CAMERA);
});

$(document).on('vclick', '#page-detail #form-add-note #img-preview #btn-close', function () {
    $('#page-detail #form-add-note #img-preview').css('display', 'none');
    $('#page-detail #form-add-note #img-preview #gallery').empty();
});

function getNoteImage(saveToPhotoAlbum, sourceType) {
    var options = {
        destinationType: Camera.DestinationType.DATA_URL,
        saveToPhotoAlbum: saveToPhotoAlbum,
        sourceType: sourceType
    };

    navigator.camera.getPicture(success, error, options);

    function success(imageData) {
        var display = $('#page-detail #form-add-note #img-preview').css('display');

        if (display == 'none') {
            $('#page-detail #form-add-note #img-preview #gallery').empty();
            $('#page-detail #form-add-note #img-preview').css('display', 'block');
        }

        $('#page-detail #form-add-note #img-preview #gallery').append(`<img src='data:image/jpeg;base64,${imageData}'>`);

    }

    function error(error) {
        alert(`Failed to get picture. Error: ${error}.`);
    }
}

//Camera update note
$(document).on('vclick', '#note #form-update-note #btn-gallery', function () {
    getUpdateNoteImage(true, Camera.PictureSourceType.PHOTOLIBRARY);
});

$(document).on('vclick', '#note #form-update-note #btn-camera', function () {
    getUpdateNoteImage(true, Camera.PictureSourceType.CAMERA);
});

$(document).on('vclick', '#note #form-update-note #img-preview #btn-close', function () {
    $('#note #form-update-note #img-preview').css('display', 'none');
    $('#note #form-update-note #img-preview #gallery').empty();
});

function getUpdateNoteImage(saveToPhotoAlbum, sourceType) {
    var options = {
        destinationType: Camera.DestinationType.DATA_URL,
        saveToPhotoAlbum: saveToPhotoAlbum,
        sourceType: sourceType
    };

    navigator.camera.getPicture(success, error, options);

    function success(imageData) {
        var display = $('#note #form-update-note #img-preview').css('display');

        if (display == 'none') {
            $('#note #form-update-note #img-preview #gallery').empty();
            $('#note #form-update-note #img-preview').css('display', 'block');
        }

        $('#note #form-update-note #img-preview #gallery').append(`<img src='data:image/jpeg;base64,${imageData}'>`);

    }

    function error(error) {
        alert(`Failed to get picture. Error: ${error}.`);
    }
}