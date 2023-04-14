var io = require("socket.io-client");

var socket = io("ws://localhost:3000");

socket.emit("processTask","nextTask");

socket.on("processTask",function(task){
  console.log(task);
})
