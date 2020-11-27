
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

}