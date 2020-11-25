
var db=require('../config/connection')
var collection =require('../config/collection')
var objectId =require('mongodb').ObjectID
module.exports={
   doLogin:(userDtails)=>{
        return new Promise(async(resolve,reject)=>{
            let user =await db.get().collection(collection.Tutor_collection).findOne({ Email: userDtails.Email,Password:userDtails.Password })
            if(user){
                // await db.get().collection(collection.Tutor_collection).findOne({Password:userDtails.Password})
               
                    console.log(user+"uiuuuuu")
                
            }
            else{
                console.log('no uuuuuuuuuusssssssssssssseeeeeeeerrrrrrr')
            }
            resolve(user)
        })
    },

}