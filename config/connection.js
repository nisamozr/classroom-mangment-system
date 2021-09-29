const mongoClient = require('mongodb').MongoClient
const state = {
    db: null
}

module.exports.connect = function (done) {
    // const url = "mongodb+srv://nisamozr:TRradk1nGzwceVGx@cluster0.gk83i.mongodb.net/classroom?retryWrites=true&w=majority";
    const url = "mongodb+srv://nisamozr:12345678as@cluster0.fu2zc.mongodb.net/classroom?retryWrites=true&w=majority";
    // const url = "mongodb://localhost:27017";
 
    const dbname = 'classroom';

    mongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex:true,
        useFindAndModify:false
    }, (err, data) => {
        if (err) return done(err)
        state.db = data.db(dbname)
        done()
    })
}
module.exports.get = function () {
    return state.db
}
