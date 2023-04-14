var express = require('express');
var router = express.Router();
var Topic = require("../model/Topic")

router.get("/",function (req,res){
    var topics = Topic.getAll();
    res.render("topics/topics",{title: "Topics", topics:topics})
});

router.get("/:topicname", function(req,res){
    var topicname = req.params.topicname;
    res.render("topics/topic",{title: "Topics", topicname:topicname})
})

module.exports = router;