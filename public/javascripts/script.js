function fileValidation() {
    var fileInput =
        document.getElementById('filePdf');

    var filePath = fileInput.value;

    // Allowing file type 
    var allowedExtensions =
        /(\.doc|\.docx|\.odt|\.pdf|\.tex|\.txt|\.rtf|\.wps|\.wks|\.wpd)$/i;

    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type');
        fileInput.value = '';
        return false;
    }
}
function videoValidation() {
    var fileInput =
        document.getElementById('videofile');

    var filePath = fileInput.value;

    // Allowing file type 
    var allowedExtensions =
        /(\.mp4|\.mkv|\.avi|\.mov|\.flv|\.webm)$/i;

    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type choose video file');
        fileInput.value = '';
        return false;
    }
}

function photoValidation() {
    var fileInput =
        document.getElementById('photoFile');

    var filePath = fileInput.value;

    // Allowing file type 
    var allowedExtensions =
        /(\.jpg|\.png|\.jpeg|\.svg|\.webp)$/i;

    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type choose image file');
        fileInput.value = '';
        return false;
    }
}

