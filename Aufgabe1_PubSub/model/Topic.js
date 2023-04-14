var topics = ["MI_NEWS","AMI_NEWS"];

var Topic = {};

Topic.add = function (name){
    topics.push(name);
}

Topic.getAll = function (name){
    return topics;
}

module.exports = Topic