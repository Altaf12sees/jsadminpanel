const {mogoUrl} = require('../keys/urlsPath')
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://wtsoldb:TopSecret123@sandbox.9sqwv.mongodb.net/User?retryWrites=true&w=majority',{useNewUrlparser:true});
var conn= mongoose.connection;
var termsconditions = new mongoose.Schema({
    termsconditions: String,
    dateandtime: String,
});

var termsconditionsModel= mongoose.model('termsconditions', termsconditions);

module.exports=termsconditionsModel;
