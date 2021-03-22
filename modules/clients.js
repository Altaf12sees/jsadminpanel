const {mogoUrl} = require('../keys/urlsPath')
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://wtsoldb:TopSecret123@sandbox.9sqwv.mongodb.net/User?retryWrites=true&w=majority',{useNewUrlparser:true});
//mongoose.connect('mongodb+srv://grdnagentbackend:grdn4736@cluster0.1r052.mongodb.net/grdnagentbackenddb?retryWrites=true&w=majority',{useNewUrlparser:true});
var conn= mongoose.connection;
var clients = new mongoose.Schema({
    clientId: { type: Number, min: 1, max: 9999 },
    clientName: String,
    clientPhone: String,
    clientPhoto: String,
    clientAddress: String,
});

var clients= mongoose.model('clients', clients);

module.exports=clients;
