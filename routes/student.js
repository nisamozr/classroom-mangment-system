var express = require('express');
var router = express.Router();
var studentHelper = require('../helpers/student-helpers');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('student/home',{student:true });
});

router.get('/login', function (req, res, next) {

    res.render('student/student-login' );
  
});
router.get('/loginOtp', function (req, res) {

  res.render('student/student-login-otp');

});


module.exports = router;
