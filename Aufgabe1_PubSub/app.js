var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var {Server} = require("socket.io");

const config = require('config');
const port = config.get('server.port');


var http = require("http");
var express = require('express');

var app = express();
var server = http.createServer(app);

app.get("/", function(req,res){
  var name = req.query.name;
  res.render('index',{title: "Start Page", name : name})
});

// app.js
var topicsRouter = require("./routes/topics");

// set controllers
app.use("/topics",topicsRouter);

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

// Socket.IO
var io = new Server(server);

const workspaces = io.of(/^\/\w+$/);

workspaces.on("connection", socket => {
    const workspace = socket.nsp;
    socket.on("message",function(msg,username){
        workspace.emit("message",msg,username);
    });
    
});

server.listen(port);
console.log(`Server listen to port ${port}`);