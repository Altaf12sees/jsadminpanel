const {mogoUrl} = require('../keys/urlsPath')
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://wtsoldb:TopSecret123@sandbox.9sqwv.mongodb.net/User?retryWrites=true&w=majority',{useNewUrlparser:true});
var conn= mongoose.connection;
var cPanel = new mongoose.Schema({
    newsletter: String,
    dateandtime: String,
    homeslider: String,
    homescreenimg: String,
    homescreenimgstatus: String,
});

var userModel= mongoose.model('cPanel', cPanel);

module.exports=userModel;
