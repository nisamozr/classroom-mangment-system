var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars')

var bodyParser = require('body-parser')
var speakeasy = require('speakeasy')

var indexRouter = require('./routes/tutor');
var usersRouter = require('./routes/student');
var db = require('./config/connection')
var session = require('express-session')

var app = express();
let fileUpload = require('express-fileupload')
var hbsHelper = hbs.create({});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
  extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/', partialsDir: __dirname + '/views/partials/' ,
  }))
  // register new function
hbsHelper.handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});
  

app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload())


app.use(session({ secret: 'key', cookie: { maxAge: 600000000000000000000 } }))

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
