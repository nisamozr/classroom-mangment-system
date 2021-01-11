const mongoClient = require('mongodb').MongoClient
const state={
    db:null
}
const mongodb ="mongodb+srv://nisamozr:TRradk1nGzwceVGx@cluster0.gk83i.mongodb.net/classroom?retryWrites=true&w=majority"
module.exports.connect=function(done){
    const url=process.env.MONGODB_URI||mongodb||'mongodb://localhost:27017'
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
