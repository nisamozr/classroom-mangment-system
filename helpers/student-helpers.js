
var db = require('../config/connection')
var collection = require('../config/collection')
const { use } = require('../routes/tutor')
const { response } = require('express')
var objectId = require('mongodb').ObjectID
module.exports = {

    verifyNumbert: (userDtails) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await db.get().collection(collection.Students_collection).findOne({Mobile: userDtails.Mobile })
            
            if (user) {
                    response.Status = true
                    response.err =false
                    resolve(response)
            }
            else {
                console.log("not user")
                response.Status = false
                response.err =true
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
    dologin:(loginDetails)=>{
        return new Promise(async(resolve,reject)=>{
            let student = await db.get().collection(collection.Students_collection).findOne({Mobile:loginDetails.Mobile})
            
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
    getStudentInfo:(userid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.Students_collection).findOne({_id:objectId(userid)}).then((user)=>{
                resolve(user)
            })
        })

    },
    getAssignment:(tutorid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.Tutor_collection).findOne({_id:objectId(tutorid)}).then((user)=>{
                resolve(user)
            })
        })

    },
    postAssignment: (tutorId, assinfo, FileAddress, fileName) => {
       
        return new Promise(async (resolve, reject) => {

            await db.get().collection(collection.Students_collection).updateOne({ _id: objectId(tutorId) },
                {
                    $push: {
                        "Assignment": {
                            "_id": new objectId(),
                            "Topic": assinfo.Topic,
                            "FileName":fileName,
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
   
   

}