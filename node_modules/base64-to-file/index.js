var mkdirp = require('mkdirp');

exports.isMatchToBase64 = function isMatchToBase64(dataString) {
    return dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
};

function decodeBase64Image(dataString) {
    var matches = exports.isMatchToBase64(dataString);
    if (matches && matches.length) {
        var response = {};
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');

        return response;
    }
    else {
        throw 'Input string is not a base64.';
    }

}


exports.convert = function (base64String, uploadLocation, acceptFileTypes, callback) {

    var fs = require('fs');

// Regular expression for image type:
// This regular image extracts the "jpeg" from "image/jpeg"
    var imageTypeRegularExpression = /\/(.*?)$/;

// Generate random string
    var crypto = require('crypto');
    var seed = crypto.randomBytes(10);
    var uniqueSHA1String = crypto
        .createHash('sha1')
        .update(seed)
        .digest('hex');


    var imageBuffer = decodeBase64Image(base64String);

    var uniqueRandomImageName = 'image-' + uniqueSHA1String;
    var imageTypeDetected = imageBuffer
        .type
        .match(imageTypeRegularExpression);

    var extension = imageTypeDetected[1];

    if (acceptFileTypes.indexOf(extension) < 0) {
        throw new Error('Invalid file type');
    }

    var writeFile = function () {
        var userUploadedImagePath = uploadLocation +
            uniqueRandomImageName + '.' +
            extension;

        try {
            fs.writeFile(userUploadedImagePath, imageBuffer.data,
                function () {
                    callback(userUploadedImagePath);
                });
        }
        catch (error) {
            throw new Error(error);
        }
    };

    if (!fs.existsSync(uploadLocation)) {
        console.log("index-50", uploadLocation);


        mkdirp(uploadLocation, function (err) {
            if (err) {
                throw error;
            }
            writeFile();
        });

    }
    else {
        writeFile();
    }


};
