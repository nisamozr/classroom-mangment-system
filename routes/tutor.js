var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { student: true });
});
router.get('/tutor',(req,res)=>{
  res.render('tutor-home',{tutor: true});

})

module.exports = router;
