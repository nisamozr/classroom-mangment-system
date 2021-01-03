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
// sideNavar toggel
$("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

//Annonsement

//image
var loadFile = function (event) {
    var output = document.getElementById('imageoutput');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
        URL.revokeObjectURL(output.src) // free memory
    }

};
function cleaarimage() {
    document.getElementById('photoFile').value = null
    document.getElementById('imageoutput').src = "#";


}

//video
var loadvideoFile = function (event) {
    var output = document.getElementById('videoview');

    let file = event.target.files[0];
    let blobURL = URL.createObjectURL(file);
    document.querySelector("#videoview").src = blobURL;

};

function clearvideo() {
    document.getElementById('videoFile').value = null
    document.getElementById('videoview').src = "";


    let vv = document.querySelector("#videoview")

    vv.removeAttribute('src');


}
function videotoggel() {
    var x = document.getElementById("videoDiv");
    vv = document.querySelector("#videoview")
    if (vv.src == "") {
        x.style.display === "none"

    }
    else {
        x.style.display = "block";

    }


}
//pdf
var loaddfFile = function (event) {
    var output = document.getElementById('pdfDoc');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
        URL.revokeObjectURL(output.src) // free memory
    }

};
function cleaarpdf() {
    document.getElementById('filePdf').value = null
    document.getElementById('pdfDoc').src = "";


}



