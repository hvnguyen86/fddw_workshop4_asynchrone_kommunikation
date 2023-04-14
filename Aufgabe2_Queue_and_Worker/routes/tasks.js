var express = require('express');
var router = express.Router();
var Topic = require("../model/Task")

router.get("/",function (req,res){
    res.render("tasks/tasks",{title: "Tasks"})
});

module.exports = router;