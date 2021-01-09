function fileValidation() {
  var fileInput = document.getElementById("filePdf");
  var filePath = fileInput.value;
  // Allowing file type
  var allowedExtensions = /(\.doc|\.docx|\.odt|\.pdf|\.tex|\.txt|\.rtf|\.wps|\.wks|\.wpd)$/i;
  if (!allowedExtensions.exec(filePath)) {
    alert("Invalid file type");
    fileInput.value = "";
    return false;
  }
}
function videoValidation() {
  var fileInput = document.getElementById("videofile");
  var filePath = fileInput.value;
  // Allowing file type
  var allowedExtensions = /(\.mp4|\.mkv|\.avi|\.mov|\.flv|\.webm)$/i;
  if (!allowedExtensions.exec(filePath)) {
    alert("Invalid file type choose video file");
    fileInput.value = "";
    return false;
  }
}
function photoValidation() {
  var fileInput = document.getElementById("photoFile");
  var filePath = fileInput.value;
  // Allowing file type
  var allowedExtensions = /(\.jpg|\.png|\.jpeg|\.svg|\.webp)$/i;
  if (!allowedExtensions.exec(filePath)) {
    alert("Invalid file type choose image file");
    fileInput.value = "";
    return false;
  }
}
// sideNavbar toggel
$("#menu-toggle").click(function (e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});

// Announcement
//image
var loadFile = function (event) {
  var outPut = document.getElementById("imageoutput");
  outPut.src = URL.createObjectURL(event.target.files[0]);
  outPut.onload = function () {
    URL.revokeObjectURL(outPut.src); // free memory
  };
};
function cleaarimage() {
  document.getElementById("photoFile").value = null;
  document.getElementById("imageoutput").src = "#";
}
//video
var loadvideoFile = function (event) {
  var outPut = document.getElementById("videoview");
  let file = event.target.files[0];
  let blobURL = URL.createObjectURL(file);
  document.querySelector("#videoview").src = blobURL;
};
function clearvideo() {
  document.getElementById("videoFile").value = null;
  document.getElementById("videoview").src = "";
  let videoView = document.querySelector("#videoview");
  videoView.removeAttribute("src");
}
function videotoggel() {
  var x = document.getElementById("videoDiv");
  vv = document.querySelector("#videoview");
  if (vv.src == "") {
    x.style.display === "none";
  } else {
    x.style.display = "block";
  }
}
//pdf
var loaddfFile = function (event) {
  var output = document.getElementById("pdfDoc");
  output.src = URL.createObjectURL(event.target.files[0]);
  output.onload = function () {
    URL.revokeObjectURL(output.src); // free memory
  };
};
function cleaarpdf() {
  document.getElementById("filePdf").value = null;
  document.getElementById("pdfDoc").src = "";
}
// imagee crop
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#blah").attr("src", e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
    setTimeout(ss, 500);
  }
}
function ss() {
  var el = document.getElementById("blah");
  const cropper = new Cropper(el, {
    aspectRatio: 16 / 9,
    crop(event) {
      console.log(event.detail.x);
      console.log(event.detail.y);
      console.log(event.detail.width);
      console.log(event.detail.height);

      document.getElementById("cropped_image").value = event.detail.x;
      document.getElementById("cropped_image1").value = event.detail.y;
      document.getElementById("cropped_image2").value = event.detail.width;
      document.getElementById("cropped_image3").value = event.detail.height;
    },
  });
}
