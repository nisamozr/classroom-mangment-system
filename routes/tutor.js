var express = require('express');
var router = express.Router();
var tutorHelper = require('../helpers/tutor-helpers');
const tutorHelpers = require('../helpers/tutor-helpers');
const studentHelpers = require('../helpers/student-helpers');
const { response } = require('express');
let FilePondPluginImageCrop = require('filepond-plugin-image-crop')
var Clipper = require('image-clipper');
var im = require('imagemagick');
const sharp = require('sharp')
var multer  = require('multer');
var upload = multer({ dest: 'public/uploded/' });
var Canvas = require('canvas');

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
router.get('/tutor', verifyLogin,async (req, res) => {
  let user = req.session.user
  let photo= await studentHelpers.getPhoto(req.session.user._id)
  let photo1 = photo[0].Photos
  let photo2 = photo[1].Photos
  let photo3 = photo[2].Photos
  let photo4 = photo[3].Photos
  res.render('tutor/tutor-home', { tutor: true, user,photo,photo1,photo2,photo3,photo4 });
  
})
router.post('/tutor', verifyLogin, (req, res) => {
  let user = req.session.user
  res.render('tutor/tutor-home', { tutor: true, user });
 
})
router.get('/toutor-photoAlbum', verifyLogin,async function (req, res, next) {
  let photo= await studentHelpers.getPhoto(req.session.user._id)

  res.render('tutor/tuotr-album', { students: true, student: req.session.student,photo });
});


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
      res.redirect('/tutor');

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
  req.session.destroy()
  res.redirect('/tutor-login')
})
router.get('/tutor', verifyLogin, (req, res) => {
  let user = req.session.user
  res.render('tutor/tutor-home', { tutor: true, user });


})
router.get('/tutor-Profile', verifyLogin, async (req, res) => {
  let tutorprofil = await tutorHelper.getTutorInfo(req.session.user._id)



  res.render('tutor/tutor-profile', { tutor: true, tutorprofil, user: req.session.user });
})
router.get('/tutor-students', verifyLogin, async (req, res) => {
  let studentslist = await tutorHelper.getStudents(req.session.user._id)
  res.render('tutor/tutor-students', { tutor: true, studentslist, user: req.session.user });
  console.log(studentslist)
})
router.get('/tutor-attendance', verifyLogin, async(req, res) => {
  

  res.render('tutor/tutor-attendance', { tutor: true, user: req.session.user });
})
router.post('/tutor-attendance', verifyLogin,async (req, res) => {
  let date = new Date(req.body.date).toLocaleString().split(',')[0]
  let attendance = await tutorHelper.getAttendance(date)
   let aa = attendance[0]
  // res.json(attendance)
  res.render('tutor/tutor-attendance', { tutor: true, user: req.session.user,attendance});
  
  // console.log(aa)
  
  


  
})
router.get('/tutor-assignment', verifyLogin, async (req, res) => {
  let assignment = await tutorHelper.getTutorInfo(req.session.user._id)
  let ass = await tutorHelper.GetAssinment(req.session.user._id)
  console.log(ass)

 
  res.render('tutor/tutor-assignment', { tutor: true, user: req.session.user, assignment ,ass});
})
router.get('/tutor-notes', verifyLogin, async (req, res) => {
  let nots = await tutorHelper.getTutorInfo(req.session.user._id)
  res.render('tutor/tutor-notes', { tutor: true, user: req.session.user, nots });
})
router.get('/tutor-announcement', verifyLogin, (req, res) => {
  res.render('tutor/tutor-announcement', { tutor: true, user: req.session.user });
})
router.get('/tutor-events', verifyLogin, (req, res) => {
  res.render('tutor/tutor-events', { tutor: true, user: req.session.user });
})
router.get('/tutor-photos', verifyLogin, (req, res) => {

  res.render('tutor/tutor-photos', { tutor: true, user: req.session.user });
})
router.post('/tutor-photos', verifyLogin, (req, res) => {
  console.log(req.body.xcrop)
  console.log(req.body.ycrop)
  let x =req.body.xcrop
  let y =req.body.ycrop
  let width =req.body.widthcrop
  let hieght =req.body.hightcrop
 
  var fileAddressa = "./public/uploded/photos/" +req.files.Photos.name
  var tosave = "./public/fgf.jpeg"
  let photoFile = req.files.Photos
  Clipper.configure({
    canvas: require('canvas')
});
//    Clipper(photoFile, function() {
//     this.crop(x, y, width, hieght)
//     .resize(50, 50)
//     .quality(80)
//     .toFile("./public/uploded/backgrssound.jpeg", function() {
//        console.log('saved!');
//    });
// })
sharp('/uploded/photos/18:11:48 GMT+0530 (India Standard Time)WhatsApp Image 2020-10-03 at 10.01.11 AM (3).jpeg')
    .extract({ left: 11, top: 0, width: 440, height: 100 })
    .toFile('/uploded/photos/18:11:48 GMT+0530 (India Standard Time)WhatsApp Image 2020-10-03 at 10.01.11 AM (3).jpeg', function (err) {
        if (err) console.log(err);
    })




  var fileAddress = "uploded/photos/" + new Date() + req.files.Photos.name
  let photoName = req.files.Photos.name
  photoFile.mv("./public/" + fileAddress, (err, done) => {
    if (!err) {
      tutorHelper.postPhoto(req.session.user._id, req.body, fileAddress, photoName).then(() => {
          res.redirect("/tutor-photos")
      })
    }
    else {
      console.log(err)
    }
  })

})
router.get('/tutor-profile-edit', verifyLogin, (req, res) => {

  res.render('tutor/tutor-profile-edit', { tutor: true, user: req.session.user });
})
router.post('/tutor-profile-edit', verifyLogin, (req, res) => {


  let image = req.files.image

  image.mv('./public/uploded/tutor/profile/' + req.session.user._id + req.files.image.name, (err, done) => {
    if (!err) {
      res.redirect("/tutor-profile")
    }
    else {
      console.log(err)

    }
  })

  tutorHelpers.editProfile(req.body, req.session.user._id, image).then(() => {
    res.redirect("/tutor-profile")
  })



})
router.get('/tutor-addStudent', verifyLogin, (req, res) => {

  res.render('tutor/tutor-addStudent', { tutor: true, user: req.session.user });

})
router.post('/tutor-addStudent', verifyLogin, (req, res) => {


  let image = req.files.image
  var fileAddress = "uploded/students/profile/" + new Date() + req.files.image.name
  image.mv("./public/" + fileAddress, (err, done) => {
    if (!err) {
      tutorHelper.addStudents(req.body, image, fileAddress).then((response) => {
        if (response.student) {
          res.render('tutor/tutor-addStudent', { tutor: true, user: req.session.user, Err: true });

        }
        else {

          res.redirect("/tutor-students")

        }
      })
    }
    else {
      console.log(err)

    }
  })

})
// student details

router.get('/tutor-studentDetails:id', verifyLogin, async (req, res) => {
  let studentId = await tutorHelper.getOneStudents(req.params.id)
  let attendance= await studentHelpers.getAttendance(req.params.id)
  
  res.render('tutor/tutor-studentDetails', { tutor: true, user: req.session.user, studentId,attendance });
})

// edit student profile
router.get('/tutor-editStudent:id', verifyLogin, async (req, res) => {
  let studentId = await tutorHelper.getOneStudents(req.params.id)
  res.render('tutor/tutor-editStudent', { tutor: true, user: req.session.user, studentId });
})
router.post('/tutor-editStudent:id', verifyLogin, async (req, res) => {
  console.log(req.params.id)
  await tutorHelper.editStudents(req.params.id, req.body).then(() => {
    res.redirect("/tutor-students")
  })

})
// terminat student
router.get('/tutor-removeStudent:id', verifyLogin, async (req, res) => {
  await tutorHelper.removeStudents(req.params.id).then((response) => {
    res.redirect("/tutor-students")
  })
})
// assignment post
router.post('/tutor-assignment', verifyLogin, (req, res) => {
  var fileAddress = "uploded/assignment/" + new Date() + req.files.AssignmentFile.name
  let AssFile = req.files.AssignmentFile
  let fileName = req.files.AssignmentFile.name
  AssFile.mv("./public/" + fileAddress, (err, done) => {
    if (!err) {
      tutorHelper.postAssignment(req.session.user._id, req.body, fileAddress, fileName).then(() => {
       
          res.redirect("/tutor-assignment")

     
      
        res.redirect("/tutor-assignment")
      
      })
    }
    else {
      console.log(err)
    }
  })
})
//assinment delet
router.get('/tutor-delet-assingnment:id', verifyLogin, async (req, res) => {
  await tutorHelper.removeAssignement(req.params.id, req.session.user._id).then((response) => {
    res.redirect("/tutor-assignment")
  })

})
router.post('/tutor-notes', verifyLogin, (req, res) => {
  
  var videoname
  var videolocation

  var Documentlocation = "uploded/notes/Document/" + new Date() + req.files.Document.name
  var Document = req.files.Document
  var Documentname = req.files.Document.name
  Document.mv("./public/" + Documentlocation)
  if(req.files.VideoFile) {
   var videolocation = "uploded/notes/video/" + new Date() + req.files.VideoFile.name
    var video = req.files.VideoFile
  var  videoname = req.files.VideoFile.name
    video.mv("./public/" + videolocation)
  }
  
  
  tutorHelper.addNots(req.session.user, req.body, Documentname, Documentlocation, videoname, videolocation).then((response) => {
    res.redirect("/tutor-notes")
  })


})
router.get('/tutor-delet-note:id', verifyLogin, async (req, res) => {
  await tutorHelper.removeNotes(req.params.id, req.session.user._id).then((response) => {
    res.redirect("/tutor-notes")
  })

})






module.exports = router;
