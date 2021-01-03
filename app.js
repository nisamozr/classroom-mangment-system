var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars')
var bodyParser = require('body-parser')
var indexRouter = require('./routes/tutor');
var usersRouter = require('./routes/student');
var db = require('./config/connection')
var session = require('express-session')

var app = express();
let fileUpload = require('express-fileupload');
const { Db } = require('mongodb');
var hbsHelper = hbs.create({});
const MongoStore = require('connect-mongo')(session);
const studentHelpers = require('./helpers/student-helpers');
var schedule = require('node-schedule');
var socketIo = require('socket.io');

var collection = require('./config/collection')
const io = socketIo();
app.io = io;



// var stream = db.get().collection(collection.Chat_collection).find().sort({ _id : -1 }).limit(10).stream();
// stream.on('data', function (chat) { socket.emit('chat', data); });
io.on('connection', (socket) => {
  
  console.log("Auth vale:" + socket.id)
  socket.on("messageSend", function(details){
    console.log(details)
    socket.broadcast.emit("messageSend",details)
  })
  socket.on("chat", function(data){
    console.log(data)
    // db.get().collection(collection.Chat_collection).insertOne({user:data.user,message:data.message})
    io.sockets.emit('chat',data)
   
  })
  socket.on('typing',function(data){
    socket.broadcast.emit('typing',data)
  })
});








// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
  extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/', partialsDir: __dirname + '/views/partials/',
}))
// register new function
hbsHelper.handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});
hbsHelper.handlebars.registerHelper('ifvalue', function (conditional, options) {
  if (options.hash.value === conditional) {
    return options.fn(this)
  } else {
    return options.inverse(this);
  }
});


var j = schedule.scheduleJob({ hour: 1, minute: 02 }, function () {
  studentHelpers.AbsentMark()

  console.log('The answer to life, the universe, and everything!');
});
console.log(j)


app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload())




app.use(session({
  secret: 'key', store: new MongoStore({
    url: 'mongodb://localhost/classroom',
    ttl: 2 * 24 * 60 * 60
  })
}))


db.connect((err) => {
  if (err) console.log("not connected err")
  else console.log("database success")
})

app.use('/', indexRouter);
app.use('/student', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
