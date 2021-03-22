const {mogoUrl} = require('../keys/urlsPath')
var mongoose = require('mongoose');
//mongoose.connect(mogoUrl);
mongoose.connect('mongodb+srv://wtsoldb:TopSecret123@sandbox.9sqwv.mongodb.net/User?retryWrites=true&w=majority',{useNewUrlparser:true});
//mongoose.connect('mongodb+srv://grdnagentbackend:grdn4736@cluster0.1r052.mongodb.net/grdnagentbackenddb?retryWrites=true&w=majority',{useNewUrlparser:true});
var conn= mongoose.connection;
var tasks = new mongoose.Schema({
    jobId:{ type: Number, min: 1, max: 9999 },
    userJobNo:String,
    jobName:String,
    jobDescribtion:String,
    jobValue:String,
    jobAssignDate:String,
    jobExpiryDate:String,
    jobStatus:String,
    clientId:String,
    // clientName: String,
    // clentPhoto: String,
    // clientAddress: String,
    jobStartDate:String,
    jobEndDate:String,
    jobStartTime:String,
    jobEndTime:String,
    agentID:String,
    jobAssignTo: String,
});

var tasks= mongoose.model('tasks', tasks);

module.exports=tasks;
