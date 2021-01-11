const mongoClient = require('mongodb').MongoClient
const state={
    db:null
}
// const mongodb ="mongodb+srv://nisamozr:TRradk1nGzwceVGx@cluster0.gk83i.mongodb.net/classroom?retryWrites=true&w=majority"
module.exports.connect=function(done){
    const url="mongo --host bngc6mqgckavvqg-mongodb.services.clever-cloud.com --port 27017 --username=uueisfbgwlkbkzrusxwc bngc6mqgckavvqg"||'mongodb://localhost:27017'
    const dbname = 'classroom'
console.log(process.env.MONGODB_URI)
    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db = data.db(dbname)
        done()
    }) 
}
module.exports.get=function(){
    return state.db
}
