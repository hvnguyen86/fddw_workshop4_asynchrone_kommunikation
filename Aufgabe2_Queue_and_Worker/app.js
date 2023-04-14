var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var {Server} = require("socket.io");
var Task = require("./model/Task")

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

app.get("/",function(req,res){
  res.render("index",{title:"Task Creator"})
})

// app.js
var tasksRouter = require("./routes/tasks");

// set controllers
app.use("/tasks",tasksRouter);

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

io.on("connection", socket => {
    
    socket.on("tasks",function(msg){
      if(msg == "getAll"){
        var tasks = Task.getAll();
        socket.emit("tasks",tasks);
      } 
    });

    socket.on("addTask",function(task){
      Task.add(task);
      var tasks = Task.getAll();
      socket.emit("tasks",tasks);
    });
  
    socket.on("processTask",function(msg){
      if(msg == "nextTask") {
        var tasks = Task.getAll();
        var task = tasks.shift();
        socket.emit("processTask",task ? task : "No more task")
      }
    })

  
    
});

server.listen(port);
console.log(`Server listen to port ${port}`);