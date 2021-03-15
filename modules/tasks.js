const {mogoUrl} = require('../keys/urlsPath')
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://wtsoldb:TopSecret123@sandbox.9sqwv.mongodb.net/User?retryWrites=true&w=majority',{useNewUrlparser:true});
//mongoose.connect('mongodb+srv://grdnagentbackend:grdn4736@cluster0.1r052.mongodb.net/grdnagentbackenddb?retryWrites=true&w=majority',{useNewUrlparser:true});
var conn= mongoose.connection;
var tasks = new mongoose.Schema({
    userTasks: String, unique:false,
    userId:String,
    dateandtime: String,
});

var tasks= mongoose.model('tasks', tasks);

module.exports=tasks;
