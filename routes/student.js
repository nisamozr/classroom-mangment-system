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

router.get('/', verifyLogin, async function (req, res, next) {
  studentHelpers.AbsentMarkOpen()
  let attendance= await studentHelpers.getAttendance(req.session.student._id)
  let photo= await studentHelpers.getPhoto(req.session.student.TutorCreatedBy)
  let photo1 = photo[0].Photos
  let photo2 = photo[1].Photos
  let photo3 = photo[2].Photos
  let photo4 = photo[3].Photos
let Attendance = attendance[0]
console.log(photo[1].Photos)
  res.render('student/home', { students: true, student: req.session.student,Attendance,photo1,photo2,photo3,photo4 });
  
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
router.post('/login-email', function (req, res) {

  if (req.session.student) {
    res.redirect('/student')
  }
  else{
  studentHelpers.doLoginEmail(req.body).then((response) => {
    if (response.Status) {
      req.session.student = response.student
      req.session.logggedIn = true

      res.redirect('/student');

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
}




});
router.get('/login', function (req, res) {
  if (req.session.student) {
    res.redirect('/student')
  }
  else {
    res.render('student/student-login');
    req.session.loginErr = false
    req.session.loginPassErr = false
  }

});
router.get('/login-otp', (req, res, next) => {
  if (req.session.student) {
    res.redirect('/student')
  }
  else {
    res.render('student/student-login-otp');
  }


})
let otpId

router.post('/login', function (req, res){
  if (req.session.student) {
    res.redirect('/student')
  }else{
  
  

  studentHelpers.verifyNumbert(req.body).then((response) => {
      if (response.Status) {
        let mobile = req.body.Mobile

        var options = {
          'method': 'POST',
          'url': 'https://d7networks.com/api/verifier/send',
          'headers': {
            'Authorization': 'Token b4f8fe36d42ef3bb5969013e5a4bfa584ceb8007'
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
      
        res.redirect('/student/login-otp')
        
        otpId = data.otp_id
      
        console.log(response.body);
      



        });


      }

      else {
        res.render('student/student-login', { loginErr: response.err });
      }
    })
  }
  
  
});


router.post('/login-otp', function (req, res) {
  
  let otp = req.body.Otp
  let reId = otpId
  console.log(reId)
 


  var options = {
    'method': 'POST',
    'url': 'https://d7networks.com/api/verifier/verify',
    'headers': {
      'Authorization': 'Token b4f8fe36d42ef3bb5969013e5a4bfa584ceb8007'
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
      res.render('student/student-login', { Err:true })

    }
    else {

  studentHelpers.dologin(req.body).then((response) => {
    if (response.Status) {
      req.session.student = response.student
      req.session.logggedIn = true
     
       res.redirect('/student')
      


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
  req.session.destroy()
  res.redirect('/student/login-email')
})

router.get('/profile', verifyLogin, async function (req, res, next) {
  let studentprofil = await studentHelpers.getStudentInfo(req.session.student._id)
  res.render('student/student-profile', { students: true, studentprofil, student: req.session.student });
});
router.get('/todays-task', verifyLogin,async function (req, res, next) {
  let TodaysNotes = await studentHelpers.todaysTask(req.session.student.TutorCreatedBy)
  
  let TodaysAssig = await studentHelpers.todaysTaskASsin(req.session.student.TutorCreatedBy)
  
  let note = TodaysNotes[0]
  let Assig =TodaysAssig[0]
  console.log(Assig)
 
  res.render('student/student-todays-task', { students: true, student: req.session.student,note,Assig });
});
router.get('/notes-attendense', verifyLogin, async function (req, res, next,) {

  
  user = req.session._id
  await studentHelpers.markAttdence(req.session.student._id).then((response) => {
    res.redirect('/student/todays-task');
  })


});
router.get('/attendance', verifyLogin,async function (req, res, next) {
  let attendance= await studentHelpers.getAttendance(req.session.student._id)
  let totalcounds= await studentHelpers.getAttendanceCound(req.session.student._id)
  let totalabsent= await studentHelpers.getAttendanceAbsentCound(req.session.student._id)
  let totalpresent= await studentHelpers.getAttendancePresendCound(req.session.student._id)
  
  
  let totalcound = totalcounds[0]
  let totalabsentcound = totalabsent[0]
  let totalpresentcound = totalpresent[0]

  let persentage = (totalpresentcound.Presend/totalcound.AttendanceCound)*100
  var persentageround = persentage.toFixed(1);
 
  console.log(persentageround)
    res.render('student/student-attendance', { students: true, student: req.session.student,attendance,totalcound,totalabsentcound,totalpresentcound,persentageround });
    
  
  

});
// assinment
router.get('/assignment', verifyLogin, async function (req, res, next) {
  let assignment = await studentHelpers.getAssignment(req.session.student.TutorCreatedBy)
  let Subassignment = await studentHelpers.getSUBAssignment(req.session.student._id)
  res.render('student/student-assignment', { students: true, student: req.session.student, assignment, Subassignment });

});
router.post('/assignment', verifyLogin, (req, res) => {
  var fileAddress = "uploded/assignment/byStudent/" + new Date() + req.files.AssignmentFile.name
  let AssFile = req.files.AssignmentFile
  let fileName = req.files.AssignmentFile.name
  let tutorId = req.session.student.TutorCreatedBy
  AssFile.mv("./public/" + fileAddress, (err, done) => {
    if (!err) {
      studentHelpers.postAssignment(req.session.student._id, tutorId, req.body, fileAddress, fileName).then(async (response) => {
        if (response.Status) {
          let TopicErr = true
          let assignment = await studentHelpers.getAssignment(req.session.student.TutorCreatedBy)
          let Subassignment = await studentHelpers.getSUBAssignment(req.session.student._id)
          res.render('student/student-assignment', { students: true, student: req.session.student, assignment, TopicErr, Subassignment });
        } else {
          res.redirect("/student/assignment")
        }
      })
    }
    else {
      console.log(err)
    }
  })
})
router.get('/assignment-delet-assingnment:id', verifyLogin, async (req, res) => {
  await studentHelpers.removeAssinment(req.params.id, req.session.student._id).then((response) => {
    res.redirect("/student/assignment")
  })
})


router.get('/notes', verifyLogin, async function (req, res, next,) {
  let notes = await studentHelpers.getAssignment(req.session.student.TutorCreatedBy)

  res.render('student/student-notes', { students: true, student: req.session.student, notes });
});


router.get('/announcement', verifyLogin, function (req, res, next) {

  res.render('student/student-announcement', { students: true, student: req.session.student });
});
router.get('/photoAlbum', verifyLogin,async function (req, res, next) {
  let photo= await studentHelpers.getPhoto(req.session.student.TutorCreatedBy)

  res.render('student/student-photoAlbum', { students: true, student: req.session.student,photo });
});






module.exports = router;
