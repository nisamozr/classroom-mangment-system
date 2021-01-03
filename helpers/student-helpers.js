
var db = require('../config/connection')
var collection = require('../config/collection')
const { use } = require('../routes/tutor')
const { response } = require('express')
const Paytm = require('paytm-pg-node-sdk');
const Razorpay=require('razorpay')
var instance = new Razorpay({
    key_id: 'rzp_test_alVcwZO2KVYyEf',
    key_secret: 'u2i29cemIcehKB6YRENwrXyb',
  });
var objectId = require('mongodb').ObjectID
module.exports = {

    verifyNumbert: (userDtails) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await db.get().collection(collection.Students_collection).findOne({ Mobile: userDtails.Mobile })

            if (user) {
                response.Status = true
                response.err = false
                resolve(response)
            }
            else {
                console.log("not user")
                response.Status = false
                response.err = true
                resolve(response)
            }
        })
    },
    doLoginEmail: (userDtails) => {
        return new Promise(async (resolve, reject) => {

            let student = await db.get().collection(collection.Students_collection).findOne({ Email: userDtails.Email })

            if (student) {
                if (student.Password == userDtails.Password) {
                    // console.log("password mach")
                    response.student = student
                    response.Status = true
                    response.Password = true
                    resolve(response)
                }
                else {
                    console.log("password not match")
                    response.Password = false
                    resolve(response)
                }
            }
            else {
                console.log("not user")
                response.Status = false
                resolve(response)
            }
        })
    },
    dologin: (loginDetails) => {
        let response = {}
        return new Promise(async (resolve, reject) => {
            let student = await db.get().collection(collection.Students_collection).findOne({ Mobile: "9744427391" })

            if (student) {
                // console.log("password mach")
                response.student = student
                response.Status = true
                resolve(response)

            }
            else {
                console.log("not user")
                response.Status = false
                resolve(response)
            }
        })
    },
    getStudentInfo: (userid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.Students_collection).findOne({ _id: objectId(userid) }).then((user) => {
                resolve(user)
            })
        })

    },
    getAssignment: (tutorid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.Tutor_collection).findOne({ _id: objectId(tutorid) }).then((user) => {
                resolve(user)
            })
        })

    },
    getSUBAssignment: (StudenId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.Students_collection).findOne({ _id: objectId(StudenId) }).then((user) => {
                resolve(user)
            })
        })

    },
    removeAssinment: (id, studentId) => {

        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.Students_collection).update(
                { '_id': objectId(studentId) },
                { $pull: { Assignment: { _id: objectId(id) } } }).then((student) => {
                    resolve(student)
                })
        })
    },
    postAssignment: (studentId, totorId, assinfo, FileAddress, fileName) => {
        let response = {}
        return new Promise(async (resolve, reject) => {
            let topic = await db.get().collection(collection.Tutor_collection).findOne({ Assignment: { $elemMatch: { Topic: assinfo.Topic } } })
            if (topic) {
                db.get().collection(collection.Students_collection).updateOne({ _id: objectId(studentId) },
                    {
                        $push: {
                            "Assignment": {
                                "_id": new objectId(),
                                "Topic": assinfo.Topic,
                                "FileName": fileName,
                                "FileAddress": FileAddress,
                                "PostAt": new Date(Date.now()).toLocaleString().split(',')[0]
                            }
                        }
                    }
                )
                    // await db.get().collection(collection.Assignment_collection).insertOne(Assignment)
                    .then((response) => {

                        resolve(response)

                    })
            }
            else {
                console.log("not user")
                response.Status = true
                resolve(response)
            }
        })
    },
    AbsentMark: () => {
        let response = {}
        return new Promise(async (resolve, reject) => {
          

          
               await db.get().collection(collection.Students_collection).updateMany({},
                    {
                        $push: {
                            "Attendance": {
                                "_id": new objectId(),

                                "Attendance": "Absent",
                                "Date": new Date(Date.now()).toLocaleString().split(',')[0],


                            }
                        }
                    }
                )
                    // await db.get().collection(collection.Assignment_collection).insertOne(Assignment)
                  
          
        })
    },
    AbsentMarkOpen: () => {
        let response = {}
        return new Promise(async (resolve, reject) => {
            let topic = await db.get().collection(collection.Students_collection).findOne({ Attendance: { $elemMatch: { Date: new Date(Date.now()).toLocaleString().split(',')[0] } } })

            if(!topic){
          
               await db.get().collection(collection.Students_collection).updateMany({},
                    {
                        $push: {
                            "Attendance": {
                                "_id": new objectId(),

                                "Attendance": "Absent",
                                "Date": new Date(Date.now()).toLocaleString().split(',')[0],


                            }
                        }
                    }
                )
                    // await db.get().collection(collection.Assignment_collection).insertOne(Assignment)
                }else{
                    console.log("Alread marked")
                }
          
        })
    },

    markAttdence: (studentId) => {
        let response = {}
        return new Promise(async (resolve, reject) => {
            let topic = await db.get().collection(collection.Students_collection).findOne({_id:objectId(studentId),$and:[{ Attendance: { $elemMatch: { Date: new Date(Date.now()).toLocaleString().split(',')[0] } } },{ Attendance: { $elemMatch: { Attendance: "Absent" } } }]})
           
            if (topic) {
                
                db.get().collection(collection.Students_collection).updateOne({_id:objectId(studentId),Attendance: {$elemMatch:{ Date:new Date(Date.now()).toLocaleString().split(',')[0]}}},
                   { 
                        "$set": {
                             "Attendance.$.Attendance": "Present"
                                //  "_id": new objectId(),
                                
                                // "Date": new Date(Date.now()).toLocaleString().split(',')[0]


                             
                        }
                    }
                    
                )
                
            }
            else {
              
                console.log("Alread marked")
               

            }
        })
    },
    todaysTask: (tuterId) => {

        return new Promise(async (resolve, reject) => {
          let tod =  await db.get().collection(collection.Tutor_collection).aggregate([{
                $match: {
                    "Notes.PostDate": new Date(Date.now()).toLocaleString().split(',')[0]
                       
                    // $gte : new Date(new Date().setDate(new Date().getDate() - 4))

                }
            }, {
                $unwind: "$Notes"
            }, {
                $match: {
                    "Notes.PostDate": new Date(Date.now()).toLocaleString().split(',')[0]
                    //     $lt : new Date(new Date().setDate(new Date().getDate() + 2)),
                    //     $gte : new Date(new Date().setDate(new Date().getDate() - 4))
                    // }
                }
            }, {
                $group: {
                    _id: "$_id",
                    Notes: {
                        $push: "$Notes"
                    }
                }
            }
            ]).toArray()
            
            resolve(tod)
           
        })
    },
    todaysTaskASsin: (tuterId) => {

        return new Promise(async (resolve, reject) => {
          let tod =  await db.get().collection(collection.Tutor_collection).aggregate([{
                $match: {
                    "Assignment.PostDate": new Date(Date.now()).toLocaleString().split(',')[0]
                       
                    // $gte : new Date(new Date().setDate(new Date().getDate() - 4))

                }
            }, {
                $unwind: "$Assignment"
            }, {
                $match: {
                    "Assignment.PostDate": new Date(Date.now()).toLocaleString().split(',')[0]
                    //     $lt : new Date(new Date().setDate(new Date().getDate() + 2)),
                    //     $gte : new Date(new Date().setDate(new Date().getDate() - 4))
                    // }
                }
            }, {
                $group: {
                    _id: "$_id",
                    Assignment: {
                        $push: "$Assignment"
                    }
                }
            }
            ]).toArray()
            
            resolve(tod)
           
        })
    },
    getAttendance: (StudenId) => {
        return new Promise((resolve, reject) => {
            let att= db.get().collection(collection.Students_collection).aggregate(
                // Initial document match (uses index, if a suitable one is available)
                { $match: {
                    _id : objectId(StudenId)
                }},
            
                // Expand the scores array into a stream of documents
                { $unwind: '$Attendance' },
            
              
              
                // Sort in descending order
                { $sort: {
                    'Attendance.Date': -1
                }},
                { $group: { _id: '$StudenId', Attendance: { $push: '$Attendance'}}}
            ).toArray()
            resolve(att)
        })

    },
    getAttendanceCound: (StudenId) => {
        return new Promise((resolve, reject) => {
            let att= db.get().collection(collection.Students_collection).aggregate(
                [
                    { $match: {
                        _id : objectId(StudenId)
                    }},
                    {
                       
                        $project: {
                            _id:0,
                            Attendance:{$size:"$Attendance"},
                        }
                    }, 
                    {
                        $group: {
                            _id:StudenId,
                            AttendanceCound:{$sum:"$Attendance"},
                        }
                    }
                ]
                
                
            ).toArray()
            resolve(att)
        })

    },
    getAttendanceAbsentCound: (StudenId) => {
        return new Promise((resolve, reject) => {
            let att= db.get().collection(collection.Students_collection).aggregate(
                [
                    {
                        $match: {
                            _id: objectId(StudenId)
                        }
                    },

                    { $unwind: '$Attendance' },
                    { $match: { "Attendance.Attendance": "Absent" } },
                  
                    {
                        $group: {
                            _id: StudenId,
                            Absend: { $sum: 1 },
                        }
                    }
                ]
                
                
            ).toArray()
            resolve(att)
        })

    },
    getAttendancePresendCound: (StudenId) => {
        return new Promise((resolve, reject) => {
            let att= db.get().collection(collection.Students_collection).aggregate(
                [
                    {
                        $match: {
                            _id: objectId(StudenId)
                        }
                    },

                    { $unwind: '$Attendance' },
                    { $match: { "Attendance.Attendance": "Present" } },
                  
                    {
                        $group: {
                            _id: StudenId,
                            Presend: { $sum: 1 },
                        }
                    }
                ]
                
                
            ).toArray()
            resolve(att)
        })

    }, 
     getPhoto: (tutuorid) => {
        return new Promise((resolve, reject) => {
            let att= db.get().collection(collection.Tutor_collection).aggregate(
                // Initial document match (uses index, if a suitable one is available)
                { $match: {
                    _id : objectId(tutuorid)
                }},
            
                // Expand the scores array into a stream of documents
                { $unwind: '$Photos' },
            
              
              
                // Sort in descending order
                { $sort: {
                    'Photos.PostAt': -1
                }},
                { $group: { _id: '$tutuorid', Photos: { $push: '$Photos'}}}
            ).toArray()
            resolve(att)
        })
    },
    getEachAnnouncement:(announceId)=>{
        return new Promise(async(resolve,reject)=>{
           let aa = await db.get().collection(collection.Announcement_collection).findOne({_id:objectId(announceId)})
          
          resolve(aa)
           
        })
      
    },
    getEachEvent:(announceId)=>{
        return new Promise(async(resolve,reject)=>{
           
           let aa = await db.get().collection(collection.Event_collection).findOne({_id:objectId(announceId)})
          
          resolve(aa)
           
        })
      
    },
    bookEvent:(book,userId)=>{
        return new Promise((resolve,reject)=>{
            let booknow={
                StudentId:objectId(userId),
                price:book.eventPrice,
                eventId:book.eventId,
                eventName:book.EventName,
                paymentmethod:book.paymentmethod,
                Date: new Date(Date.now()).toLocaleString().split(',')[0],
                
            }
            db.get().collection(collection.BookedEvent_collection).insertOne(booknow).then((response)=>{
                resolve(response)
            })
          
          
           
        })
      
    },
    generatRazorPay:(amount)=>{
        return new Promise((resolve,reject)=>{
           
            var options = {
                amount: amount*100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: ""+new objectId()
              };
              instance.orders.create(options, function(err, order) {
                  if(err){
                      console.log(err)
                  }else{
              
                resolve(order)
                  }
              })
        })


    },
    verifyPayment:(details)=>{
        return new Promise((resolve,reject)=>{
            const crypto = require('crypto');
            let hmac = crypto.createHmac('sha256', 'SeajYNgUZuu193R4knI5vBQR');

            hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]']);
            hmac=hmac.digest('hex')
            if(hmac==details['payment[razorpay_signature]']){
                resolve()
                
            }
            else{
                reject()
            }
        })
    },
    // generatpaytm:(amount)=>{
    //     return new Promise((resolve,reject)=>{
    //         var environment = Paytm.LibraryConstants.STAGING_ENVIRONMENT;

    //         // For Production 
    //         // var environment = Paytm.LibraryConstants.PRODUCTION_ENVIRONMENT;
            
    //         // Find your mid, key, website in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
    //         var mid = "AKlFNW11785226604992";
    //         var key = "0v5nBBkT#kXOJoLt";
    //         var website = "WEBSTAGING";
    //         var client_id = "WEB";
            
    //         var callbackUrl = "https://securegw-stage.paytm.in/order/status";
    //         Paytm.MerchantProperties.setCallbackUrl(callbackUrl);
            
    //         Paytm.MerchantProperties.initialize(environment, mid, key, client_id, website);
    //         // If you want to add log file to your project, use below code
    //         Paytm.Config.logName = "[PAYTM]";
    //         Paytm.Config.logLevel = Paytm.LoggingUtil.LogLevel.INFO;
    //         Paytm.Config.logfile = "/path/log/file.log";
            
              
          
    //     })


    // },
   





}