var express = require('express');
var router = express.Router();
var tutorHelper = require('../helpers/tutor-helpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index'  );
});
router.get('/tutor-login', function(req, res, next) {
  res.render('tutor-login'  );
});
router.post('/tutor-login', function(req, res, next) {

  tutorHelper.doLogin(req.body,()=>{
    res.render('tutor'  );
  })
  
});

router.get('/tutor',(req,res)=>{
  res.render('tutor-home',{tutor: true});

})
router.get('/tutor-Profile',(req,res)=>{
  res.render('tutor-profile',{tutor: true});

})
router.get('/tutor-students',(req,res)=>{
  res.render('tutor-students',{tutor: true});

})
router.get('/tutor-attendance',(req,res)=>{
  res.render('tutor-attendance',{tutor: true});

})
router.get('/tutor-assignment',(req,res)=>{
  res.render('tutor-assignment',{tutor: true});

})
router.get('/tutor-notes',(req,res)=>{
  res.render('tutor-notes',{tutor: true});

})
router.get('/tutor-announcement',(req,res)=>{
  res.render('tutor-announcement',{tutor: true});

})
router.get('/tutor-events',(req,res)=>{
  res.render('tutor-events',{tutor: true});

})
router.get('/tutor-photos',(req,res)=>{
  res.render('tutor-photos',{tutor: true});

})
router.get('/tutor-profile-edit',(req,res)=>{
  res.render('tutor-profile-edit',{tutor: true});

})





module.exports = router;
