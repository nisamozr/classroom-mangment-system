
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
    getTutorInfo:(userid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.Tutor_collection).findOne({_id:objectId(userid)}).then((user)=>{
                resolve(user)
            })
        })

    },
    editProfile:(proDetails,userid,proimage)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collection.Tutor_collection).updateOne({_id:objectId(userid)},{
                $set:{
                    Name:proDetails.Name,
                    Email:proDetails.Email,
                    Mobile:proDetails.Mobile,
                    Address:proDetails.Address,
                    Gender:proDetails.Gender,
                    image:proimage
                }
            }).then((response)=>{
                resolve()
            })
          
        })
    },
    addStudents:(studentDetails)=>{
        return new Promise(async(resolve,reject)=>{

        //    let studentUser = await db.get().collection(collection.Students_collection).findOne(studentDetails.Mobile)
        //     if(studentUser)
            
            await db.get().collection(collection.Students_collection).insertOne(studentDetails).then((data)=>{
                resolve()
            })
            // else{
            //     console.log("user is ther")
           
            // }
        })
    },
    getStudents:(tutorId)=>{
        return new Promise(async(resolve,reject)=>{
           let student = await db.get().collection(collection.Students_collection).find().toArray()

                resolve(student)
          
        })
    },
    getOneStudents:(studentId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.Students_collection).findOne({_id:objectId(studentId)}).then((student)=>{
                resolve(student)
            })
        })
    },
    editStudents:(studentId,updateinfo)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.Students_collection).updateOne({_id:objectId(studentId)},{
                $set:{
                    Name:updateinfo.Name,
                    Email:updateinfo.Email,
                    Mobile:updateinfo.Mobile,
                    Address:updateinfo.Address,
                    Class:updateinfo.Class
                }
            }).then((student)=>{
                resolve(student)
            })
        })
    },
    removeStudents:(studentId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.Students_collection).removeOne({_id:objectId(studentId)}).then((student)=>{
                resolve(student)
            })
        })
    }
   

}