var express = require('express');
var router = express.Router();
var studentHelper = require('../helpers/student-helpers');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/login', function (req, res, next) {
  

    res.render('student/student-login', { "logiEnrr": req.session.loginErr, "loginPass": req.session.loginPassErr });
  
});

module.exports = router;
