var express = require('express');
var router = express.Router();
const { response } = require('express');
const studentHelpers = require('../helpers/student-helpers');
// otp 

const request = require('request');

const tutorHelpers = require('../helpers/tutor-helpers');
const checksum = require('paytmchecksum')
const paytm = require('paytm-nodejs')
const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });
var qs = require('querystring')
const checksum_lib = require("../Paytm/checksum");
const config = require("../Paytm/config");
var paypal = require('paypal-rest-sdk');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AbgZZWlwvmQ-90o3lCOb0dcMt1SY43GD4RYVYKDvYUFkPnaWxAGiXMdPwPYap-uN7FHUJ1DQ9PsZzesE',
  'client_secret': 'EH1jLh3wxsP8rG8R1_JKuM5ez13JF8Gy95RfpZRudvLXSAqYeofXkkMNtTb7yjjfG4vyBnNyfTTugo4u'
});

var CLIENT = 'AbgZZWlwvmQ-90o3lCOb0dcMt1SY43GD4RYVYKDvYUFkPnaWxAGiXMdPwPYap-uN7FHUJ1DQ9PsZzesE';
var SECRET = 'EH1jLh3wxsP8rG8R1_JKuM5ez13JF8Gy95RfpZRudvLXSAqYeofXkkMNtTb7yjjfG4vyBnNyfTTugo4u';
var PAYPAL_API = 'https://api-m.sandbox.paypal.com';
// const config = {
//     MID : 'AKlFNW11785226604992', // Get this from Paytm console
//     KEY : '0v5nBBkT#kXOJoLt', // Get this from Paytm console
//     ENV : 'dev', // 'dev' for development, 'prod' for production
//     CHANNEL_ID : 'WEB',
//     INDUSTRY : 'Retail',  
//     WEBSITE : 'WEBSTAGING',
//     CALLBACK_URL : '/true/paytmresp',  // webhook url for verifying payment
// }



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
  let attendance = await studentHelpers.getAttendance(req.session.student._id)
  let photo = await studentHelpers.getPhoto(req.session.student.TutorCreatedBy)
  let photo1 = photo[0].Photos
  let photo2 = photo[1].Photos
  let photo3 = photo[2].Photos
  let photo4 = photo[3].Photos
  let Attendance = attendance[0]
  let event = await tutorHelpers.getEvent(req.session.student.TutorCreatedBy)

  let annoncement = await tutorHelpers.getAnnoncement(req.session.student.TutorCreatedBy)

  res.render('student/home', { students: true, student: req.session.student, Attendance, photo1, photo2, photo3, photo4, annoncement, event });

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

  if (req.session.student) {
    res.redirect('/student')
  }
  else {
    studentHelpers.doLoginEmail(req.body).then((response) => {
      if (response.Status) {
        req.session.student = response.student
        req.session.logggedIn = true

        res.redirect('/student/');

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

router.post('/login', function (req, res) {
  if (req.session.student) {
    res.redirect('/student')
  } else {



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
      res.render('student/student-login', { Err: true })

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
router.get('/todays-task', verifyLogin, async function (req, res, next) {
  let TodaysNotes = await studentHelpers.todaysTask(req.session.student.TutorCreatedBy)

  let TodaysAssig = await studentHelpers.todaysTaskASsin(req.session.student.TutorCreatedBy)

  let note = TodaysNotes[0]
  let Assig = TodaysAssig[0]


  res.render('student/student-todays-task', { students: true, student: req.session.student, note, Assig });
});
router.get('/notes-attendense', verifyLogin, async function (req, res, next,) {


  user = req.session._id
  await studentHelpers.markAttdence(req.session.student._id).then((response) => {
    res.redirect('/student/todays-task');
  })


});
router.get('/attendance', verifyLogin, async function (req, res, next) {
  let attendance = await studentHelpers.getAttendance(req.session.student._id)
  let totalcounds = await studentHelpers.getAttendanceCound(req.session.student._id)
  let totalabsent = await studentHelpers.getAttendanceAbsentCound(req.session.student._id)
  let totalpresent = await studentHelpers.getAttendancePresendCound(req.session.student._id)


  let totalcound = totalcounds[0]
  let totalabsentcound = totalabsent[0]
  let totalpresentcound = totalpresent[0]

  let persentage = (totalpresentcound.Presend / totalcound.AttendanceCound) * 100
  var persentageround = persentage.toFixed(1);


  res.render('student/student-attendance', { students: true, student: req.session.student, attendance, totalcound, totalabsentcound, totalpresentcound, persentageround });




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


router.get('/announcement', verifyLogin, async function (req, res, next) {
  let annoncement = await tutorHelpers.getAnnoncement(req.session.student.TutorCreatedBy)

  res.render('student/student-announcement', { students: true, student: req.session.student, annoncement });
});
router.get('/eachannouncement:id', verifyLogin, async function (req, res, next) {

  let eachannoncement = await studentHelpers.getEachAnnouncement(req.params.id)


  res.render('student/student-eachAnnoncement', { students: true, student: req.session.student, eachannoncement });
});

router.get('/photoAlbum', verifyLogin, async function (req, res, next) {
  let photo = await studentHelpers.getPhoto(req.session.student.TutorCreatedBy)

  res.render('student/student-photoAlbum', { students: true, student: req.session.student, photo });
});
router.get('/events', verifyLogin, async function (req, res, next) {
  let event = await tutorHelpers.getEvent(req.session.student.TutorCreatedBy)


  res.render('student/student-events', { students: true, student: req.session.student, event });
});
router.get('/eachevent:id', verifyLogin, async function (req, res, next) {
  let eachevent = await studentHelpers.getEachEvent(req.params.id)


  res.render('student/student-eachevents', { students: true, student: req.session.student, eachevent });
});
router.post('/eachevent', verifyLogin, async function (req, res, next) {



  if (req.body.paymentmethod == "RazorPay") {
    studentHelpers.generatRazorPay(req.body.eventPrice).then((response) => {
      res.json(resp = { response, razorpay: true })



    })
  }
  else if (req.body.paymentmethod == "Paypal") {
    // studentHelpers.generatRazorPay(req.body.eventPrice).then((response) => {
    // res.json(resp = { response, paypal: true })
    // })
    res.redirect('/student/paynow')




  }


});
router.post('/paypal-payment', function (req, res) {
  // 2. Call /v1/payments/payment to set up the payment
  console.log(req.body)
  request.post(PAYPAL_API + '/v1/payments/payment',
    {
      auth:
      {
        user: CLIENT,
        pass: SECRET
      },
      body:
      {
        intent: 'sale',
        payer:
        {
          payment_method: 'paypal'
        },
        transactions: [
          {
            amount:
            {
              total: req.body.amount,
              currency: 'INR'
            }
          }],
        redirect_urls:
        {
          return_url: 'https://localhost:3000/tutor-home',
          cancel_url: 'https://localhost:3000/student'
        }
      },
      json: true
    }, function (err, response) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      // 3. Return the payment ID to the client
      res.json(
        {
          id: response.body.id

        });
      

    });
})

router.post('/execute-paypal-payment', function (req, res) {
  // 2. Get the payment ID and the payer ID from the request body.
  var paymentID = req.body.paymentID;
  var payerID = req.body.payerID;
  // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
  request.post(PAYPAL_API + '/v1/payments/payment/' + paymentID +
    '/execute',
    {
      auth:
      {
        user: CLIENT,
        pass: SECRET
      },
      body:
      {
        payer_id: payerID,
        transactions: [
          {
            amount:
            {
              total: '10.99',
              currency: 'USD'
            }
          }]
      },
      json: true
    },
    function (err, response) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      console.log('hdhhfg')
      // 4. Return a success response to the client
      res.json(
        {
          status: 'success'
          
        });
    });
})


router.post("/paynow", [parseUrl, parseJson], (req, res) => {
  var paymentDetails = {
    amount: req.body.eventPrice,
    customerId: req.body.EventName,

  }
  if (!paymentDetails.amount || !paymentDetails.customerId) {
    res.status(400).send('Payment failed')
  } else {
    var params = {};
    params['MID'] = config.PaytmConfig.mid;
    params['WEBSITE'] = config.PaytmConfig.website;
    params['CHANNEL_ID'] = 'WEB';
    params['INDUSTRY_TYPE_ID'] = 'Retail';
    params['ORDER_ID'] = 'TEST_' + new Date().getTime();
    params['CUST_ID'] = paymentDetails.customerId;
    params['TXN_AMOUNT'] = paymentDetails.amount;
    params['CALLBACK_URL'] = 'http://localhost:3000/student/callback';
    params['EMAIL'] = paymentDetails.customerEmail;
    params['MOBILE_NO'] = paymentDetails.customerPhone;


    checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
      var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
      // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

      var form_fields = "";
      for (var x in params) {
        form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
      }
      form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
      res.end();
    });
  }
})

router.post("/callback", (req, res) => {
  // Route for verifiying payment

  var body = '';

  req.on('data', function (data) {
    body += data;
  });

  req.on('end', function () {
    var html = "";
    var post_data = qs.parse(body);

    // received params in callback
    console.log('Callback Response: ', post_data, "\n");


    // verify the checksum
    var checksumhash = post_data.CHECKSUMHASH;
    // delete post_data.CHECKSUMHASH;
    var result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
    console.log("Checksum Result => ", result, "\n");


    // Send Server-to-Server request to verify Order Status
    var params = { "MID": config.PaytmConfig.mid, "ORDERID": post_data.ORDERID };

    checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {

      params.CHECKSUMHASH = checksum;
      post_data = 'JsonData=' + JSON.stringify(params);

      var options = {
        hostname: 'securegw-stage.paytm.in', // for staging
        // hostname: 'securegw.paytm.in', // for production
        port: 443,
        path: '/merchant-status/getTxnStatus',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': post_data.length
        }
      };


      // Set up the request
      var response = "";
      var post_req = https.request(options, function (post_res) {
        post_res.on('data', function (chunk) {
          response += chunk;
        });

        post_res.on('end', function () {
          console.log('S2S Response: ', response, "\n");

          var _result = JSON.parse(response);
          if (_result.STATUS == 'TXN_SUCCESS') {
            res.send('payment sucess')
          } else {
            res.send('payment failed')
          }
        });
      });

      // post the data
      post_req.write(post_data);
      post_req.end();
    });
  });
});
router.post('/true/paytmresp', (req, res) => {
  console.log("body: ", req.body);
})
router.post('/verify-payment', (req, res) => {

  studentHelpers.verifyPayment(req.body).then(() => {
    // studentHelpers.changePaymentStatuse(req.body['order[receipt]']).then(()=>{
    console.log('payment successful')
    res.json({ ss: true })
    // })

  }).catch((err) => {
    console.log(err)
    res.json({ ss: false })
  })
})
router.post('/paytm', (req, res) => {
  // For Staging 





})


router.post('/bookenow', (req, res) => {

  studentHelpers.bookEvent(req.body, req.session.student._id).then((response) => {
    res.json(response)


  })



})

router.get('/chat', verifyLogin,  function (req, res, next) {
  


  res.render('student/student-chat', { students: true, student: req.session.student});
});










module.exports = router;
