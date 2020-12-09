
var db = require('../config/connection')
var collection = require('../config/collection')
const { use } = require('../routes/tutor')
const { response } = require('express')
var objectId = require('mongodb').ObjectID
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
                            "PostAt": new Date(Date.now()).toLocaleString().split(',')[0]
                        }
                    }
                }
            )
                // await db.get().collection(collection.Assignment_collection).insertOne(Assignment)
                .then((response) => {
                    console.log(response)
                    resolve(response)

                })
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
                            "PostAt": new Date(Date.now()).toLocaleString().split(',')[0]


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




}