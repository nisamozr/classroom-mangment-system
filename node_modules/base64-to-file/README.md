# base64ToFile
    npm install base64-to-file
    
    var base64ToFile = require('base64-to-file');
    base64ToFile.convert(data.image,"upload/",['jpg','jpeg','png'], function (filePath) {
        console.log(filePath);
    });
