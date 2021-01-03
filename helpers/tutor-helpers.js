
var db = require('../config/connection')
var collection = require('../config/collection')
const { use } = require('../routes/tutor')
const { response } = require('express')
var objectId = require('mongodb').ObjectID
var dateFormat = require('dateformat');
module.exports = {
    doLogin: (userDtails) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await db.get().collection(collection.Tutor_collection).findOne({ Email: userDtails.Email })

            if (user) {
                if (user.Password == userDtails.Password) {
                    // console.log("password mach")
                    response.user = user
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
    getTutorInfo: (userid) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.Tutor_collection).findOne({ _id: objectId(userid) }).then((user) => {
                resolve(user)
            })
        })

    },
    editProfile: (proDetails, userid, proimage) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.Tutor_collection).updateOne({ _id: objectId(userid) }, {
                $set: {
                    Name: proDetails.Name,
                    Email: proDetails.Email,
                    Mobile: proDetails.Mobile,
                    Address: proDetails.Address,
                    Gender: proDetails.Gender,
                    image: proimage
                }
            }).then((response) => {
                resolve()
            })

        })
    },
    addStudents: (studentDetails, proimage, filelocation) => {
        var studentInfo = {
            Name: studentDetails.Name,
            Mobile: studentDetails.Mobile,
            Email: studentDetails.Email,
            Class: studentDetails.Class,
            Address: studentDetails.Address,
            Gender: studentDetails.Gender,
            Password: studentDetails.Password,
            image: proimage,
            imagelocation: filelocation,
            TutorCreatedBy: studentDetails.TutorCreatedBy
            

        }
        return new Promise(async (resolve, reject) => {

            let studentUser = await db.get().collection(collection.Students_collection).findOne({
                $or: [
                    { Mobile: studentDetails.Mobile },
                    { Email: studentDetails.Email },
                    { Name: studentDetails.Name }
                ]
            })

            if (studentUser) {
                response.student = studentUser
                resolve(response)

            }

            else {


                await db.get().collection(collection.Students_collection).insertOne(studentInfo).then((response) => {
                    resolve(response)

                })

            }
        })
    },
    getStudents: (tutorId) => {
        return new Promise(async (resolve, reject) => {
            let student = await db.get().collection(collection.Students_collection).find().toArray()

            resolve(student)

        })
    },
    getOneStudents: (studentId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.Students_collection).findOne({ _id: objectId(studentId) }).then((student) => {
                resolve(student)
            })
        })
    },
  
    editStudents: (studentId, updateinfo) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.Students_collection).updateOne({ _id: objectId(studentId) }, {
                $set: {
                    Name: updateinfo.Name,
                    Email: updateinfo.Email,
                    Mobile: updateinfo.Mobile,
                    Address: updateinfo.Address,
                    Class: updateinfo.Class,
                    Password: updateinfo.Password
                }
            }).then((student) => {
                resolve(student)
            })
        })
    },
    removeStudents: (studentId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.Students_collection).removeOne({ _id: objectId(studentId) }).then((student) => {
                resolve(student)
            })
        })
    },
    postAssignment: (tutorId, assinfo, FileAddress, fileName) => {
      
        return new Promise(async (resolve, reject) => {

            await db.get().collection(collection.Tutor_collection).updateOne({ _id: objectId(tutorId) },
                {
                    $push: {
                        "Assignment": {
                            "_id": new objectId(),
                            "Topic": assinfo.Topic,
                            "FileName": fileName,
                            "FileAddress": FileAddress,
                            "PostAt": dateFormat(new Date(), "dd-mm-yyyy h:MM"),
                              "PostDate": new Date(Date.now()).toLocaleString().split(',')[0],
                        }
                    }
                }
            )
                // await db.get().collection(collection.Assignment_collection).insertOne(Assignment)
                .then((response) => {
                 
                    resolve(response)

                })
        })
    },
      GetAssinment: (tutorId) => {
        return new Promise(async(resolve, reject) => {
           let ass= await db.get().collection(collection.Tutor_collection).find({_id:objectId(tutorId)}).sort({Assignment : -1}).toArray()
            resolve(ass)
        })
    },
    removeAssignement: (id, tutorid) => {
        console.log(id, tutorid)
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.Tutor_collection).update(
                { '_id': objectId(tutorid) },
                { $pull: { Assignment: { _id: objectId(id) } } }).then((student) => {
                    resolve(student)
                })
        })
    },
    addNots: (userid, userPost, DocumentName,DocumentAddress, videoname,VideoAddress) => {

        return new Promise(async(resolve, reject) => {


            await db.get().collection(collection.Tutor_collection).updateOne({ _id: objectId(userid._id)},
                {
                    $push: {
                        "Notes": {
                            "_id": new objectId(),
                            "Topic": userPost.Topic,
                            "DocumentName": DocumentName,
                            "DocumentAddress": DocumentAddress,
                            "VideoName": videoname,
                            "VideoAddress": VideoAddress,
                            "Link":userPost.Link,
                            "PostDate": new Date(Date.now()).toLocaleString().split(',')[0],
                            "PostAt": dateFormat(new Date(), "dd-mm-yyyy h:MM")


                        }
                    }

                }

            )

        .then((response) => {
            console.log(response)
            resolve(response)

        })
    })



    },
    removeNotes:(id, tutorid) => {
       
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.Tutor_collection).update(
                { '_id': objectId(tutorid) },
                { $pull: { Notes: { _id: objectId(id) } } }).then((student) => {
                    resolve(student)
                })
        })
    },
    getAttendance:(date) => {
      
        return new Promise(async (resolve, reject) => {
            let att = await db.get().collection(collection.Students_collection).aggregate([
                { $unwind: "$Attendance" },
                { $match: {  "Attendance.Date": date } },
                { $project: { _id: 0,Name:1, "Attendance.Attendance": 1,"Attendance.Date":1 } }
             ])
            // aggregate([
            //     {$match:{"Attendance.Date":date}},
            //     {$project:
                
            //              {
                     
            //                 Name: 1,
            //                  Mobile:1,
            //                  Attendance:[ { $eq: [ "$Date", date ] }]
                          
            //              }
            //      },
                

            //    ])
            
            
            .toArray()
            resolve(att)
          
        })
    },
    postPhoto: (tutorId, photoinfo, image,FileAddress) => {
      
        return new Promise(async (resolve, reject) => {

            await db.get().collection(collection.Tutor_collection).updateOne({ _id: objectId(tutorId) },
                {
                    $push: {
                        "Photos": {
                            "_id": new objectId(),
                            "Topic": photoinfo.Topic,
                            "FileName": image,
                            "FileAddress": FileAddress,
                            "PostAt": dateFormat(new Date(), "dd-mm-yyyy h:MM"),
                              "PostDate": new Date(Date.now()).toLocaleString().split(',')[0],
                        }
                    }
                }
            )
                // await db.get().collection(collection.Assignment_collection).insertOne(Assignment)
                .then((response) => {
                    
                    resolve(response)

                })
        })
    },
    addAnnoncement: (userid, userPost, imageName,imageAddress, videoname,VideoAddress,pfdName,pdfAddress) => {
        let data= {
            "poatedBy":userid,
        
            "Message": userPost.Message,
            "Description":userPost.Description,
        
        "pdfName": pfdName,
        "pdfAddress": pdfAddress,
        "VideoName": videoname,
        "VideoAddress": VideoAddress,
        "ImageName":imageName,
        "ImageAddress":imageAddress  ,
       
       
        "PostDate": new Date(Date.now()).toLocaleString().split(',')[0],
        "PostAt": dateFormat(new Date(), "dd-mm-yyyy h:MM")


    }
        return new Promise(async(resolve, reject) => {


            await db.get().collection(collection.Announcement_collection).insertOne(data)

            .then((response) => {
            console.log(response)
            resolve(response)

            })
        
        
    })
},
getAnnoncement: (tutorId) => {
    return new Promise(async(resolve, reject) => {
       let ass= await db.get().collection(collection.Announcement_collection).find().sort({PostDate : -1}).toArray()
       console.log(ass)
        resolve(ass)
    })
},

addEvent: (userid, userPost, imageName,imageAddress, videoname,VideoAddress,pfdName,pdfAddress) => {
    let data= {
            "poatedBy":userid,
        "EventName": userPost.EventName,
        "ConductingBy":userPost.ConductingBy,
        "Topic":userPost.Topic,
        "EventDate":userPost.EventDate,
        "pdfName": pfdName,
        "pdfAddress": pdfAddress,
        "VideoName": videoname,
        "VideoAddress": VideoAddress,
        "ImageName":imageName,
        "ImageAddress":imageAddress  ,
        "EventType":userPost.EventType,
        "Price":userPost.Price,
        "PostDate": new Date(Date.now()).toLocaleString().split(',')[0],
        "PostAt": dateFormat(new Date(), "dd-mm-yyyy h:MM")


    }
    return new Promise(async(resolve, reject) => {
        await db.get().collection(collection.Event_collection).insertOne(data) .then((response) => {
            console.log(response)
            resolve(response)


       
        })
    
    
})
},
getEvent: (tutorId) => {
    return new Promise(async(resolve, reject) => {
       let ass= await db.get().collection(collection.Event_collection).find().sort({PostDate : -1}).toArray()
       console.log(ass)
        resolve(ass)
    })
},




}
