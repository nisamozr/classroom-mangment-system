var express = require('express');
var router = express.Router();
var tutorHelper = require('../helpers/tutor-helpers');
const tutorHelpers = require('../helpers/tutor-helpers');
const { response } = require('express');

const verifyLogin = (req, res, next) => {
  if (req.session.logggedIn) {
    next()
  }
  else {
    res.redirect('/tutor-login')
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});
router.get('/tutor', verifyLogin, (req, res) => {
  let user = req.session.user
  res.render('tutor/tutor-home', { tutor: true, user });
  console.log(user)
})

router.get('/tutor-login', function (req, res, next) {
  if (req.session.user) {
    res.redirect('/tutor')
  }
  else {

    res.render('tutor/tutor-login', { "logiEnrr": req.session.loginErr, "loginPass": req.session.loginPassErr });
    req.session.loginErr = false
    req.session.loginPassErr = false
  }

});
router.post('/tutor-login', function (req, res, next) {

  tutorHelper.doLogin(req.body).then((response) => {
    if (response.Status) {
      req.session.user = response.user
      req.session.logggedIn = true
      res.render('tutor/tutor-home', { response, tutor: true, user: req.session.user });
      console.log(req.session.user)
    }
    else if (response.Password == false) {
      req.session.loginPassErr = true
      res.redirect('/tutor-login')

    }
    else {
      req.session.loginErr = true
      res.redirect('/tutor-login')
    }
  })
});
router.get('/tutor-logout', (req, res) => {
  req.session.user = null
  res.redirect('/tutor-login')
})
router.get('/tutor', verifyLogin, (req, res) => {
  let user = req.session.user
  
  res.render('tutor/tutor-home', { tutor: true, user });
  console.log(user)
})
router.get('/tutor-Profile', verifyLogin, async (req, res) => {
  let tutorprofil = await tutorHelper.getTutorInfo(req.session.user._id)

  res.render('tutor/tutor-profile', { tutor: true, tutorprofil });
})
router.get('/tutor-students', verifyLogin,async(req, res) => {
  let studentslist = await tutorHelper.getStudents(req.session.user._id)
  res.render('tutor/tutor-students', { tutor: true ,studentslist});
  console.log(studentslist)
})
router.get('/tutor-attendance', verifyLogin, (req, res) => {
  res.render('tutor/tutor-attendance', { tutor: true });
})
router.get('/tutor-assignment', verifyLogin, (req, res) => {
  res.render('tutor/tutor-assignment', { tutor: true });
})
router.get('/tutor-notes', verifyLogin, (req, res) => {
  res.render('tutor/tutor-notes', { tutor: true });
})
router.get('/tutor-announcement', verifyLogin, (req, res) => {
  res.render('tutor/tutor-announcement', { tutor: true });
})
router.get('/tutor-events', verifyLogin, (req, res) => {
  res.render('tutor/tutor-events', { tutor: true });
})
router.get('/tutor-photos', verifyLogin, (req, res) => {

  res.render('tutor/tutor-photos', { tutor: true });
})
router.get('/tutor-profile-edit', verifyLogin, (req, res) => {

  res.render('tutor/tutor-profile-edit', { tutor: true });
})
router.post('/tutor-profile-edit',verifyLogin, (req, res) => {


  let image = req.files.image

  image.mv('./public/uploded/tutor/profile/' + req.session.user._id + req.files.image.name, (err, done) => {
    if (!err) {
      res.redirect("/tutor-profile")
    }
    else {
      console.log(err)
    
    }
  })

  tutorHelpers.editProfile(req.body, req.session.user._id,image).then(() => {
    res.redirect("/tutor-profile")
  })



})
router.get('/tutor-addStudent', verifyLogin, (req, res) => {
 
  res.render('tutor/tutor-addStudent', { tutor: true,user:req.session.user });

})
router.post('/tutor-addStudent',verifyLogin,(req,res)=>{
  tutorHelper.addStudents(req.body).then(()=>{
    res.redirect("/tutor-students")
  })
})


// edit student profile
router.get('/tutor-editStudent:id', verifyLogin, async(req, res) => {
  let studentId =await tutorHelper. getOneStudents(req.params.id) 
  res.render('tutor/tutor-editStudent', { tutor: true,user:req.session.user,studentId });
})
router.post('/tutor-editStudent:id', verifyLogin, async(req, res) => {
  console.log(req.params.id)
  await tutorHelper.editStudents(req.params.id,req.body).then(()=>{
    res.redirect("/tutor-students")
  })
 
})



// terminat student
router.get('/tutor-removeStudent:id', verifyLogin, async(req, res) => {
  await tutorHelper.removeStudents(req.params.id).then((response)=>{
    res.redirect("/tutor-students")
  })
 
  
 
  

})






module.exports = router;
