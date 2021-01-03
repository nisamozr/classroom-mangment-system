var express = require('express');
var router = express.Router();
var tutorHelper = require('../helpers/tutor-helpers');
const tutorHelpers = require('../helpers/tutor-helpers');
const studentHelpers = require('../helpers/student-helpers');
const { response } = require('express');

var im = require('imagemagick');
const sharp = require('sharp')
var multer = require('multer');
var Clipper = require('image-clipper')
var canvas = require('canvas');
// var clipper = Clipper();
 
// clipper.injectNodeCanvas(Canvas);

var base64ToImage = require('base64-to-image');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage })






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
router.get('/tutor', verifyLogin, async (req, res) => {
  let user = req.session.user
  let photo = await studentHelpers.getPhoto(req.session.user._id)
  // let photo1 = photo[0].Photos
  // let photo2 = photo[1].Photos
  // let photo3 = photo[2].Photos
  // let photo4 = photo[3].Photos
  let annoncement = await tutorHelper.getAnnoncement(req.session.user._id)
  let event = await tutorHelper.getEvent(req.session.user._id)


  res.render('tutor/tutor-home', { tutor: true, user, annoncement, event, photo });

})
router.post('/tutor', verifyLogin, (req, res) => {
  let user = req.session.user
  res.render('tutor/tutor-home', { tutor: true, user });

})
router.get('/toutor-photoAlbum', verifyLogin, async function (req, res, next) {
  let photo = await studentHelpers.getPhoto(req.session.user._id)
  console.log(photo)

  res.render('tutor/tuotr-album', { students: true, student: req.session.student, photo });
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

})
router.get('/tutor-attendance', verifyLogin, async (req, res) => {


  res.render('tutor/tutor-attendance', { tutor: true, user: req.session.user });
})
router.post('/tutor-attendance', verifyLogin, async (req, res) => {
  let date = new Date(req.body.date).toLocaleString().split(',')[0]
  let attendance = await tutorHelper.getAttendance(date)
  let aa = attendance[0]
  // res.json(attendance)
  res.render('tutor/tutor-attendance', { tutor: true, user: req.session.user, attendance });

  // console.log(aa)





})
router.get('/tutor-assignment', verifyLogin, async (req, res) => {
  let assignment = await tutorHelper.getTutorInfo(req.session.user._id)
  let ass = await tutorHelper.GetAssinment(req.session.user._id)



  res.render('tutor/tutor-assignment', { tutor: true, user: req.session.user, assignment, ass });
})
router.get('/tutor-notes', verifyLogin, async (req, res) => {
  let nots = await tutorHelper.getTutorInfo(req.session.user._id)
  res.render('tutor/tutor-notes', { tutor: true, user: req.session.user, nots });
})
// Announcement
router.get('/tutor-announcement', verifyLogin, (req, res) => {
  res.render('tutor/tutor-announcement', { tutor: true, user: req.session.user });
})
router.post('/tutor-announcement', verifyLogin, (req, res) => {

  if (!req.files) {
    res.render('tutor/tutor-announcement', { tutor: true, user: req.session.user, err: true });

  }
  else {
    var image
    var imagelocation
    var Documentlocation
    var Documentname
    var videolocation
    var videoname
    console.log(req.files)

    if (req.files.Photo) {
      var imagelocation = "uploded/annoncement/images/" + new Date() + req.files.Photo.name
      var image = req.files.Photo
      var imagename = req.files.Photo.name
      image.mv("./public/" + imagelocation)

    }
    if (req.files.PdfFile) {
      var Documentlocation = "uploded/annoncement/pdf/" + new Date() + req.files.PdfFile.name
      var Document = req.files.PdfFile
      var Documentname = req.files.PdfFile.name
      Document.mv("./public/" + Documentlocation)


    }
    if (req.files.Video) {

      var videolocation = "uploded/annoncement/video/" + new Date() + req.files.Video.name
      var video = req.files.Video
      var videoname = req.files.Video.name
      video.mv("./public/" + videolocation)

    }


    tutorHelper.addAnnoncement(req.session.user._id, req.body, imagename, imagelocation, videoname, videolocation, Documentname, Documentlocation).then((response) => {
      res.redirect('/tutor-announcement')
    })

  }
})

// event
router.get('/tutor-events', verifyLogin, (req, res) => {
  res.render('tutor/tutor-events', { tutor: true, user: req.session.user });
})
router.post('/tutor-events', verifyLogin, (req, res) => {
  var image
  var imagelocation
  var Documentlocation
  var Documentname
  var videolocation
  var videoname

  if (!req.files) {

    tutorHelper.addEvent(req.session.user._id, req.body, imagename, imagelocation, videoname, videolocation, Documentname, Documentlocation).then((response) => {
      res.redirect('/tutor-events')
    })




  }
  else {

    if (req.files.Photos) {
      var imagelocation = "uploded/events/image/" + new Date() + req.files.Photos.name
      var image = req.files.Photos
      var imagename = req.files.Photos.name
      image.mv("./public/" + imagelocation)

    }
    if (req.files.FilePdf) {
      var Documentlocation = "uploded/events/pdf/" + new Date() + req.files.FilePdf.name
      var Document = req.files.FilePdf
      var Documentname = req.files.FilePdf.name
      Document.mv("./public/" + Documentlocation)


    }
    if (req.files.VideoFile) {

      var videolocation = "uploded/events/video/" + new Date() + req.files.VideoFile.name
      var video = req.files.VideoFile
      var videoname = req.files.VideoFile.name
      video.mv("./public/" + videolocation)

    }
    tutorHelper.addEvent(req.session.user._id, req.body, imagename, imagelocation, videoname, videolocation, Documentname, Documentlocation).then((response) => {
      res.redirect('/tutor-events')
    })
  }



})

router.get('/tutor-photos', verifyLogin, (req, res) => {

  res.render('tutor/tutor-photos', { tutor: true, user: req.session.user });
})
router.post('/tutor-photos', verifyLogin, (req, res) => {
  var source = req.files.Photos
  let blob = req.body
  console.log(blob)
  var x =Number(req.body.xcrop)
  var y =  Number( req.body.ycrop)
  var width =Number( req.body.widthcrop)
  var height = Number(req.body.hightcrop)
  console.log(x,y,width,height)
  
  var clipper = Clipper();
  clipper.configure('canvas',canvas)
  Clipper(source)
  .crop(x, y, width, height)
   .toFile('./result.jpg', function() {
     console.log('saved!');
  });

  // Clipper(source, function() {
  //   this.crop(x, y, width, height)
  //   .resize(50, 50)
  //   .quality(80)
  //   .toFile('./public/result.jpeg', function() {
  //      console.log('saved!');
  //  });
  // });
  
  // Clipper.image(imageaaa).crop(x, y, width, hight)
  // .toFile('./public/result.jpg', function() {
  //    console.log('saved!');
  // });

  // var fileAddress = new Date() + req.files.Photos.name
  // var ff = "./public/"
  // // // let photoName = req.files.Photos.name
  // image.mv("./public/" + fileAddress, (err, done) => {
  //    if (!err) {

  //  


  //  }
  //   else {
  //     console.log(err)
  //   }
  // })


  





  tutorHelper.postPhoto(req.session.user._id, req.body, blob).then(() => {
    res.redirect("/tutor-photos")
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
  let attendance = await studentHelpers.getAttendance(req.params.id)

  res.render('tutor/tutor-studentDetails', { tutor: true, user: req.session.user, studentId, attendance });
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
  if (req.files.VideoFile) {
    var videolocation = "uploded/notes/video/" + new Date() + req.files.VideoFile.name
    var video = req.files.VideoFile
    var videoname = req.files.VideoFile.name
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
router.get('/tutor-chat', verifyLogin, (req, res) => {

  res.render('tutor/tutor-chat', { tutor: true, user: req.session.user });
})
router.get('/tutor-bookedEvent', verifyLogin, (req, res) => {

  res.render('tutor/EventBooked', { tutor: true, user: req.session.user });
})






module.exports = router;
