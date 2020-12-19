
var db = require('../config/connection')
var collection = require('../config/collection')
const { use } = require('../routes/tutor')
const { response } = require('express')
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
            console.log(topic)
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
    }
   





}