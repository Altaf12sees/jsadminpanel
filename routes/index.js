var express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
var router = express.Router();
const {mogoUrl} = require('../keys/urlsPath')
var userModel= require('../modules/users');
var tasksModel=require('../modules/tasks');
var adminModel= require('../modules/admin');
var termsconditionsModel= require('../modules/termsconditions');

var getusers=userModel.find({});
var getPosts=adminModel.find({});
var getTasks=tasksModel.find({});
var terms=termsconditionsModel.find({}).limit(1).sort({_id:-1});

router.use( express.static( "public" ) );

var cc="";
mongoose.connect(mogoUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log("connected to mongo")
})

mongoose.connection.on('error',(err)=>{
    console.log("this is error",err)
})

/* GET home page. */

router.get('/', function(req, res, next) {
  let name="wtsol.org"
  res.render('index',{'user':name});
});


router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/add', function(req, res, next) {
  res.render('forms');
});

router.get('/view', function(req, res, next) {
  res.render('tables');
});

router.get('/addnew', function(req, res, next) {
  res.render('addnewuser');
});

router.get('/tasks', function(req, res, next) {
  res.render('tasks');
});

router.get('/errorpage', function(req, res, next) {
  res.render('errorpage');
});

router.post('/addnewuser',function(req,res,next){
  new userModel({
       username:req.body.username,
       phone:req.body.phone,
       password: req.body.password,
       joiningdate:req.body.joiningdate,
       skills:req.body.skills,
       resignationDate: req.body.resignationDate,
       profileimage:req.body.profileimage,
      }).save(function(err, docs){
       if(err)
       {
         res.redirect('../errorpage')
       }
       else
       {
         res.redirect('../dashboard')
       }
      });
})

 router.get('/dashboard', function(req, res, next) {
  getusers.exec(function(err, data){
    if(err) throw err;
  res.render('dashboard',{'dashboard': getusers, records: data, base_url: "http://" + req.headers.host});
    });
});

//show user
router.get('/show/:id', function(req,res,next){
  userModel.findById(req.params.id, function(err, data){
    if(err){
      console.log(err)
    }else{
      res.render('show',{'show':userModel, records: data, base_url: "http://" + req.headers.host});
    }
  });
});

//Show all tasks
router.get('/showTasks', function(req,res,next){
  getTasks.exec(function(err, data){
    if(err) throw err;
    res.render('tasks',{'tasks':getTasks, tasksShow: data, base_url: "http://" + req.headers.host});
    });
  });

//show task
router.get('/showtasks/:id', function(req,res,next){
  tasksModel.findById(req.params.id, function(err, data){
    if(err){
      console.log(err)
    }else{
      res.render('show',{'show':tasksModel, records: data, base_url: "http://" + req.headers.host});
    }
  });
});

//delete tasks
router.get('/deletetask/:id', function(req,res,next){
  tasksModel.findByIdAndRemove(req.params.id, function(err, data){
    if(err){
      res.redirect('../errorpage')
    }else{
      res.redirect('../showTasks')
    }
  });
});

//call edit task page
router.get('/editTasks/:id', function(req, res, next) {
  tasksModel.findById(req.params.id, function(err, data){
    if(err){
      res.render('Error! Try again.')
    }else{
      res.render('editTasks',{'editTasks':tasksModel, records: data, base_url: "http://" + req.headers.host});
    }
  })
});


//update tasks
router.post('/updateTasks/:id', function(req, res, next) {
  var today=new Date();
  const datauser={
      userTasks:req.body.userTasks,
      dateandtime:today.getDate()+" "+today.toLocaleString('default',{month: 'short'})+" "+today.getFullYear()+"/ "+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
  }
  tasksModel.findByIdAndUpdate(req.params.id, datauser, function(err){
    if(err){
        res.redirect('../editTasks'+req.params.id);
    }else{
      res.redirect('../showTasks');
    }
  })
});


router.get('/delete/:id', function(req,res,next){
  userModel.findByIdAndRemove(req.params.id, function(err, data){
    if(err){
      res.redirect('../errorpage')
    }else{
      res.redirect('../dashboard')
    }
  });
});

router.get('/edit/:id', function(req, res, next) {
  userModel.findById(req.params.id, function(err, data){
    if(err){
      res.render('Error! Try again.')
    }else{
      res.render('edit',{'edit':userModel, records: data, base_url: "http://" + req.headers.host});
    }
  })
});

router.post('/update/:id', function(req, res, next) {
  console.log(req.body);
  const datauser={
      username:req.body.username,
      phone:req.body.phone,
      password: req.body.password,
      joiningdate:req.body.joiningdate,
      skills:req.body.skills,
      resignationDate: req.body.resignationDate,
      profileimage:req.body.profileimage,
      accountStatus:req.body.accountStatus,
  }
  userModel.findByIdAndUpdate(req.params.id, datauser, function(err){
    if(err){
        res.redirect('../edit'+req.params.id);
    }else{
      res.redirect('../dashboard');
    }
  })
});

//APIs for newsletter <....... Start ........>

//get all posts
router.get('/cpanel', function(req,res, next){
  getPosts.exec(function(err, data){
  if(err) throw err;
  res.render('controlers', {'controlers':getPosts, myposts: data, base_url: "http://"+req.headers.host});
});
})

//add new post
router.post('/addnewsletter',function(req,res,next){
  var today=new Date();
  new adminModel({
       newsletter:req.body.newsletter,
       dateandtime: today.getDate()+" "+today.toLocaleString('default',{month: 'short'})+" "+today.getFullYear()+"/ "+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
      }).save(function(err, docs){
       if(err)
       {
         res.json(err);
         console.log("error")
       }
       else
       {
         res.redirect('../cpanel')
       }
      });
})

//Delete post
router.get('/deletepost/:id', function(req,res,next){
  adminModel.findByIdAndRemove(req.params.id, function(err, data){
    if(err){
      res.redirect('../cpanel')
    }else{
      res.redirect('../cpanel')
    }
  });
});

router.get('/editposts/:id', function(req, res, next) {
  adminModel.findById(req.params.id, function(err, data){
    if(err){
      res.render('Error! Try again.')
    }else{
      res.render('editposts',{'editposts':adminModel, records: data, base_url: "http://" + req.headers.host});
    }
  })
});

router.post('/updateposts/:id', function(req, res, next) {
  console.log(req.body);
  const datauser={
      newsletter:req.body.newsletter
  }
  adminModel.findByIdAndUpdate(req.params.id, datauser, function(err){
    if(err){
      res.redirect('../cpanel')
    }else{
      res.redirect('../cpanel')
    }
  })
});
//APIs for newsletter <....... End ........>

//APIs for terms&conditions <....start....>

var idd="604465bf3191af9552c33656";
router.post('/updateterms/'+idd, function(req, res, next) {
  var today=new Date();
  console.log(req.body);
  const frmData={
      termsconditions:req.body.termsconditions,
      dateandtime: today.getDate()+" "+today.toLocaleString('default',{month: 'short'})+" "+today.getFullYear()+"/ "+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
  }
  termsconditionsModel.findByIdAndUpdate(req.params.id, frmData, function(err){
    if(err){
      res.redirect('../cpanel')
    }else{
      res.redirect('../cpanel')
    }
  })
});

router.post('/addterms',function(req,res,next){
  var today=new Date();
  new termsconditionsModel({
       termsconditions:req.body.termsconditions,
       dateandtime: today.getDate()+" "+today.toLocaleString('default',{month: 'short'})+" "+today.getFullYear()+"/ "+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
      }).save(function(err, docs){
       if(err)
       {
         res.json(err);
         console.log("error")
       }
       else
       {
         res.redirect('../cpanel')
       }
      });
})

//get all terms & conditions
router.get('/getTerms', function(req,res, next){
  terms.exec(function(err, data){
  if(err) throw err;
  res.render('editTermsConditions', {'editTermsConditions':terms, termsD: data, base_url: "http://"+req.headers.host});
});
})


router.post('/sendTasks/:id',function(req,res,next){
  var id=req.params.id;
  var today=new Date();
  new tasksModel({
       userId:id,
       userTasks:req.body.tasks,
       dateandtime: today.getDate()+" "+today.toLocaleString('default',{month: 'short'})+" "+today.getFullYear()+"/ "+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
      }).save(function(err){
       if(err)
       {
         res.json(err);
         console.log("error")
       }
       else
       {
         res.redirect('../cpanel')
       }
      });
})




module.exports = router;
