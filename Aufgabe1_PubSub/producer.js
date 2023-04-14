var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var io = require("socket.io-client");
var Topic = require("./model/Topic");

var http = require("http");
var express = require('express');

var app = express();
var server = http.createServer(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));

// set middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var topics = Topic.getAll();

var topicChannels = {};

for (let index = 0; index < topics.length; index++) {
    const topic = topics[index];
    var socket = io("ws://localhost:3000/"+topic);
    topicChannels[topic] = socket;
}

app.post("/news", function(req,res){
    var news = req.body.news;
    var topic = req.body.topic;
    var socket = topicChannels[topic];
    //console.log(topicChannels);
    socket.emit("message",news);
    res.redirect("/")
});

app.get("/",function(req,res){
    res.render("news/newsForm",{title:"News Form", topics:topics})
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



  
  
server.listen(4000);
console.log(`Server listen to port 4000`);
