var express = require('express');
var router = express.Router();
var tutorHelper = require('../helpers/tutor-helpers')


const verifyLogin = (req,res,next)=>{
  if(req.session.user){
    next()
  }
  else{
    res.redirect('/tutor-login')
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index'  );
});
router.get('/tutor',verifyLogin,(req,res)=>{
  let user =req.session.user
  res.render('tutor-home',{tutor: true,user});
  console.log(user)

})


router.get('/tutor-login', function(req, res, next) {
  if(req.session.user){
    res.redirect('/tutor')
  }
  else{

  res.render('tutor-login',{"logiEnrr":req.session.loginErr,"loginPass":req.session.loginPassErr}  );
  req.session.loginErr=false
  req.session.loginPassErr=false
  }
  
});
router.post('/tutor-login', function(req, res, next) {

  tutorHelper.doLogin(req.body).then((response)=>{
    if(response.Status){

      req.session.user=response.user
      req.session.user.logggedIn=true
      
      res.render('tutor-home',{response,tutor: true,user:req.session.user}  );
      console.log(req.session.user)
    }
    else if(response.Password == false){
      req.session.loginPassErr=true
      // response.password == false
      
      res.redirect('/tutor-login')

    }
    else {
      
      // req.session.loginErr=true
      // response.password == false
      req.session.loginErr=true
      
      res.redirect('/tutor-login')
    }
   
  })

  
});

router.get('/tutor-logout',(req,res)=>{
  req.session.user=null
  res.redirect('/tutor-login')
})
router.get('/tutor',verifyLogin,(req,res)=>{
  let user =req.session.user
  res.render('tutor-home',{tutor: true,user});
  console.log(user)

})


router.get('/tutor-Profile',verifyLogin,(req,res)=>{
  res.render('tutor-profile',{tutor: true});

})
router.get('/tutor-students',verifyLogin,(req,res)=>{
  res.render('tutor-students',{tutor: true});

})
router.get('/tutor-attendance',verifyLogin,(req,res)=>{
  res.render('tutor-attendance',{tutor: true});

})
router.get('/tutor-assignment',verifyLogin,(req,res)=>{
  res.render('tutor-assignment',{tutor: true});

})
router.get('/tutor-notes',verifyLogin,(req,res)=>{
  res.render('tutor-notes',{tutor: true});

})
router.get('/tutor-announcement',verifyLogin,(req,res)=>{
  res.render('tutor-announcement',{tutor: true});

})
router.get('/tutor-events',verifyLogin,(req,res)=>{
  res.render('tutor-events',{tutor: true});

})
router.get('/tutor-photos',verifyLogin,(req,res)=>{
  res.render('tutor-photos',{tutor: true});

})
router.get('/tutor-profile-edit',verifyLogin,(req,res)=>{
  res.render('tutor-profile-edit',{tutor: true});

})
router.get('/tutor-addStudent',verifyLogin,(req,res)=>{
  res.render('tutor-addStudent',{tutor: true});

})





module.exports = router;
