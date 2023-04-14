var tasks = ["Lernen","Schlafen","Essen"];

var Task = {};

Task.add = function (name){
    tasks.push(name);
}

Task.getAll = function (name){
    return tasks;
}

module.exports = Task