var express = require('express');
var router = express.Router();
const { response } = require('express');
const studentHelpers = require('../helpers/student-helpers');
// otp 

const request = require('request');
const tutorHelpers = require('../helpers/tutor-helpers');



const verifyLogin = (req, res, next) => {
  if (req.session.logggedIn) {
    next()
  }
  else {
    res.redirect('/student/login-email')
  }
}

/* GET users listing. */

router.get('/login', function (req, res, next) {
  if (req.session.student) {
    res.redirect('/student')
  }
  else {

    res.render('student/student-login');
    req.session.loginErr = false
    req.session.loginPassErr = false
  }

});
router.get('/login-email', function (req, res, next) {



  if (req.session.student) {
    res.redirect('/student')
  }
  else {

    res.render('student/student-login-email', { "logiErr": req.session.loginErr, "loginPass": req.session.loginPassErr });
    req.session.loginErr = false
    req.session.loginPassErr = false
  }


});
router.post('/login-email', function (req, res, next) {

  studentHelpers.doLoginEmail(req.body).then((response) => {
    if (response.Status) {
      req.session.student = response.student
      req.session.logggedIn = true

      res.render('student/home', { response, students: true, student: req.session.student });

    }
    else if (response.Password == false) {
      req.session.loginPassErr = true
      res.redirect('/student/login-email')

    }
    else {
      req.session.loginErr = true
      res.redirect('/student/login-email')
    }
  })




});


router.post('/login', function (req, res, next) {
  studentHelpers.verifyNumbert(req.body).then((response) => {


    if (response.Status) {
      let mobile = req.body.Mobile

      var options = {
        'method': 'POST',
        'url': 'https://d7networks.com/api/verifier/send',
        'headers': {
          'Authorization': 'Token ed11cb49a46f90af9b837538767c4b676e296756'
        },
        formData: {
          'mobile': '91' + mobile,
          'sender_id': 'SMSINFO',
          'message': 'Your otp code is {code}',
          'expiry': '900'
        }
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        let data = JSON.parse(response.body)
        res.render('student/student-login-otp', { mobile, otp: data.otp_id })

        console.log(response.body);



      });


    }

    else {
      res.render('student/student-login', { loginErr: response.err });
    }

  })
});

router.get('/login-otp', (req, res, next) => {
  if (req.session.student) {
    res.redirect('/student')
  }
  else {

    res.redirect('student/login')

  }


})

router.post('/login-otp', function (req, res, next) {
  let otp = req.body.Otp
  let reId = req.body.request_id
  console.log(reId)



  var options = {
    'method': 'POST',
    'url': 'https://d7networks.com/api/verifier/verify',
    'headers': {
      'Authorization': 'Token ed11cb49a46f90af9b837538767c4b676e296756'
    },
    formData: {
      'otp_id': reId,
      'otp_code': otp
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    let data = JSON.parse(response.body)
    if (data.otp_code == "Invalid otp code" || data.status == "failed") {
      res.redirect('/student/login')

    }
    else {

      studentHelpers.dologin(req.body).then((response) => {
        if (response.Status) {
          req.session.student = response.student
          req.session.logggedIn = true
          res.render('student/home', { response, students: true, student: req.session.student });


        }
        else {
          // req.session.loginErr = true
          res.redirect('/student/login')
        }
      })
    }
    console.log(response.body);
  });



});
router.get('/logout', (req, res) => {
  req.session.student = null
  res.redirect('/student/login-email')
})
router.get('/', verifyLogin, function (req, res, next) {
  res.render('student/home', { students: true, student: req.session.student });
});
router.get('/profile', verifyLogin, async function (req, res, next) {
  let studentprofil = await studentHelpers.getStudentInfo(req.session.student._id)
  res.render('student/student-profile', { students: true, studentprofil, student: req.session.student });
});
router.get('/todays-task', verifyLogin, function (req, res, next) {
  res.render('student/student-todays-task', { students: true, student: req.session.student });
});
router.get('/attendance', verifyLogin, function (req, res, next) {
  res.render('student/student-attendance', { students: true, student: req.session.student });
});
// assinment
router.get('/assignment', verifyLogin, async function (req, res, next) {
  let assignment = await studentHelpers.getAssignment(req.session.student.TutorCreatedBy)
  let Subassignment = await studentHelpers.getSUBAssignment(req.session.student._id)
  res.render('student/student-assignment', { students: true, student: req.session.student, assignment,Subassignment});

});
router.post('/assignment', verifyLogin, (req, res) => {
  var fileAddress = "uploded/assignment/byStudent/" + new Date() + req.files.AssignmentFile.name
  let AssFile = req.files.AssignmentFile
  let fileName = req.files.AssignmentFile.name
  let tutorId = req.session.student.TutorCreatedBy
  AssFile.mv("./public/" + fileAddress, (err, done) => {
    if (!err) {
      studentHelpers.postAssignment(req.session.student._id,tutorId, req.body, fileAddress, fileName).then(async(response) => {
        if(response.Status){
          let TopicErr =true
          let assignment = await studentHelpers.getAssignment(req.session.student.TutorCreatedBy)
          let Subassignment = await studentHelpers.getSUBAssignment(req.session.student._id)
          res.render('student/student-assignment', { students: true, student: req.session.student, assignment,TopicErr,Subassignment});
        }else{
        res.redirect("/student/assignment")
        }
      })
    }
    else {
      console.log(err)
    }
  })
})

router.get('/notes', verifyLogin, function (req, res, next,) {

  res.render('student/student-notes', { students: true, student: req.session.student });
});
router.get('/announcement', verifyLogin, function (req, res, next) {

  res.render('student/student-announcement', { students: true, student: req.session.student });
});





module.exports = router;
