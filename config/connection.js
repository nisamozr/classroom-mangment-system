const mongoClient = require('mongodb').MongoClient
const state={
    db:null
}
module.exports.connect=function(done){
    const url="mongodb+srv://nisam:101415as@cluster0.onk0e.mongodb.net/classroom?retryWrites=true&w=majority"||'mongodb://localhost:27017'
    const dbname = 'classroom'

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db = data.db(dbname)
        done()
    }) 
}
module.exports.get=function(){
    return state.db
}
