const {mogoUrl} = require('../keys/urlsPath')
var mongoose = require('mongoose');
//mongoose.connect('mongodb+srv://grdnagentbackend:grdn4736@cluster0.1r052.mongodb.net/grdnagentbackenddb?retryWrites=true&w=majority',{useNewUrlparser:true});
mongoose.connect('mongodb+srv://wtsoldb:TopSecret123@sandbox.9sqwv.mongodb.net/User?retryWrites=true&w=majority',{useNewUrlparser:true});
var conn= mongoose.connection;
var users = new mongoose.Schema({
    username: String,
    phone: String,
    password: String,
    joiningdate: String,
    skills: String,
    resignationDate: String,
    profileimage: String,
    accountStatus: String,
    emaratesIDFront: String,
    emaratesIDBack: String,
    agentDrivingLicenceFront: String,
    agentDrivingLicenceBack: String,
    empCardFront: String,
    empCardBack: String,
    visaCopy: String,
});

var userModel= mongoose.model('users', users);

module.exports=userModel;
