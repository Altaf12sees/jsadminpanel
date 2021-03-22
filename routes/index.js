var express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
var router = express.Router();
const {mogoUrl} = require('../keys/urlsPath')
var userModel= require('../modules/users');
var tasksModel=require('../modules/tasks');
var clientsModel=require('../modules/clients');
var adminModel= require('../modules/admin');
var termsconditionsModel= require('../modules/termsconditions');

//Quries
var getusers=userModel.find({});
var getPosts=adminModel.find({});
var getTasks=tasksModel.find({});
var getClients= clientsModel.find({});

var counterID=tasksModel.find().sort({jobId:-1}).limit(1);
var counterClientID=clientsModel.find().sort({clientId:-1}).limit(1);

var countUsers=userModel.countDocuments({});
var countTasks=tasksModel.countDocuments({});
var countClients=clientsModel.countDocuments({});

var countUsersActive=userModel.countDocuments({accountStatus:"Active"});
var countUsersInactive=userModel.countDocuments({accountStatus:"Inactive"});

var countActiveTasks=tasksModel.countDocuments({jobStatus:"Active"});
var countTasksDone=tasksModel.countDocuments({jobStatus:"Done"});
// var usersTasks=tasksModel.find({});
 
var newJoinings=userModel.countDocuments({joiningdate:{$lte: new Date('2021-3-10')}});
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

router.get('/adminLogin/:username', function(req, res, next){
   const username=req.params.username;
   console.log(username)
  res.redirect('../login')
  
  // const password=req.params.password;
  // if(username=='user' && password=='admin123'){
  //   res.redirect('../dashboard')
  // }else{
  //   res.redirect('../login')
  // }
})

router.get('/add', function(req, res, next) {
  res.render('forms');
});

router.get('/view', function(req, res, next) {
  res.render('tables');
});

router.get('/addnew', function(req, res, next) {
  res.render('addnewuser');
});

router.get('/addClients', function(req, res, next){
  res.render('clients');
});

router.get('/tasks', function(req, res, next) {
  res.render('edittasks');
});

router.get('/errorpage', function(req, res, next) {
  res.render('errorpage');
});

router.get('/edittasks', function(req, res, next){
  res.render('edittasks');
})

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
         res.redirect('../userinfo')
       }
      });
})

 router.get('/userinfo', function(req, res, next) {
  getusers.exec(function(err, data){
    if(err) throw err;
  res.render('userinfo',{'userinfo': getusers, records: data, base_url: "http://" + req.headers.host});
    });
});

router.get('/userTasksAssigment', function(req, res, next){


})

router.get('/mainDashboard', function(req, res, next) {
  countUsers.exec(function(err, getCountUserResult){
    if(err){res.send(err)}
    else{
  countUsersInactive.exec(function(err, getCountInactiveUserResult){
    if(err){res.send(err)}
    else{
  countUsersActive.exec(function(err, getCountActiveUserResult){
    if(err){res.send(err)}
    else{
  countTasks.exec(function(err, getCountTasks){
    if(err){res.send(err)} 
     else{
  countClients.exec(function(err, getCountClients){
    if(err){res.send(err)} 
    else{
  countTasksDone.exec(function(err, getCountTasksDone){
    if(err){res.send(err)} 
    else{
  countActiveTasks.exec(function(err, getCountActiveTasks){
      if(err){res.send(err)} 
    else{
      res.render('mainDashboard',{'mainDashboard': 
      countUsers, countuser: getCountUserResult, 
      countUsersActive, countactiveusers: getCountActiveUserResult,
      countUsersInactive, countinactiveusers: getCountInactiveUserResult,
      countTasks, counttasks: getCountTasks,
      countActiveTasks, countactivetasks: getCountActiveTasks,
      countTasksDone, counttasksdone: getCountTasksDone,
      countClients, countclients: getCountClients,
      base_url: "http://" + req.headers.host});
                          }
                        });
                       }
                      });
                    }
                  });
                }
              });
            }
          });
         }
      });
    }
  });
});

router.get('/countDocuments',function(req,res){
    countUsers.exec(function(err, result){
        if(err){
            res.send(err)
        }
        else{
           // res.json(result)
           res.render('mainDashboard',{'mainDashboard': countUsers, countuser: result, base_url: "http://" + req.headers.host});
 
        }
   });
})
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
    else{
  getusers.exec(function(err, getusers){
    if(err) throw err;
    else{
    getClients.exec(function(err, getclients){
      if(err) throw err;
    else{
    res.render('tasks',{'tasks':
    getTasks, tasksShow: data,
    getusers, showusers: getusers,
    getClients, showclients: getclients,
    base_url: "http://" + req.headers.host});
    }
            });
          }
        });
      }
    });
  });

//edit tasks
router.get('/editJobPage/:id', function(req, res, next) {
  tasksModel.findById(req.params.id, function(err, data){
    if(err){
      res.render('Error! Try again.')
    }else{
  getusers.exec(function(err, getusers){
    if(err) throw err;
    else{
  getClients.exec(function(err, getclients){
      if(err) throw err;
    else{
      res.render('edittasks',{'edittasks':
      tasksModel, records: data,
      getusers, showusers: getusers,
      getClients, showclients: getclients,
      base_url: "http://" + req.headers.host});
    }
    });
    }
  });
    }
  })
});

//delete tasks 🟢
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
router.get('/updatejob/:id', function(req, res, next) {
  tasksModel.findById(req.params.id, function(err, data){
    if(err){
      res.render('Error! Try again.')
    }else{
      res.render('edittasks',{'edittasks':tasksModel, records: data, base_url: "http://" + req.headers.host});
    }
  })
});


//add new task
router.post('/addNewJob', function(req, res, next) {
  counterID.exec(function(err, data){
    if(err) throw err;

  var today=new Date();
  new tasksModel({
      jobName:req.body.userTasks,
      userJobNo:req.body.userJobNo,
      jobName:req.body.jobName,
      jobDescribtion:req.body.jobDescribtion,
      jobValue:req.body.jobValue,
      jobAssignDate:req.body.jobAssignDate,
      jobExpiryDate:req.body.jobExpiryDate,
      jobStatus:req.body.jobStatus,
      clientId:req.body.clientId,
      jobStartDate:req.body.jobStartDate,
      jobEndDate:req.body.jobEndDate,
      jobStartTime:req.body.jobStartTime,
      jobEndTime:req.body.jobEndTime,
      agentID:req.body.agentID,
      jobId:data[0].jobId+1,
      jobAssignTo:req.body.agentID,
  }).save(function(err){
    if(err){
        res.redirect('../errorpage');
    }else{
      res.redirect('../showTasks');
    }
  });
  })
});

//update tasks
router.post('/updateTasks/:id', function(req, res, next) {
  counterID.exec(function(err, data){
    if(err) throw err;
  var today=new Date();
  const datauser={
      jobName:req.body.userTasks,
      jobId:counterID,
      userJobNo:req.body.userJobNo,
      jobName:req.body.jobName,
      jobDescribtion:req.body.jobDescribtion,
      jobValue:req.body.jobValue,
      jobAssignDate:req.body.jobAssignDate,
      jobExpiryDate:req.body.jobExpiryDate,
      jobStatus:req.body.jobStatus,
      clientId:req.body.clientId,
      jobStartDate:req.body.jobStartDate,
      jobEndDate:req.body.jobEndDate,
      jobStartTime:req.body.jobStartTime,
      jobEndTime:req.body.jobEndTime,
      agentID:req.body.agentID,
      jobId:data.jobId,
  }

  tasksModel.findByIdAndUpdate(req.params.id, datauser, function(err){
    if(err){
        res.redirect('../editTasks'+req.params.id);
    }else{
      res.redirect('../showTasks');
    }
  });
  })
});


router.get('/delete/:id', function(req,res,next){
  userModel.findByIdAndRemove(req.params.id, function(err, data){
    if(err){
      res.redirect('../errorpage')
    }else{
      res.redirect('../userinfo')
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
      res.redirect('../userinfo');
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

// Add Clients 
router.post('/addClients', function(req, res, next) {
  counterClientID.exec(function(err, data){
    if(err) throw err;

  var today=new Date();
  new clientsModel({
      clientId:data[0].clientId+1,
      clientName:req.body.clientName,
      clientPhone: req.body.clientPhone,
      clientPhoto:req.body.clientPhoto,
      clientAddress:req.body.clientAddress,
  }).save(function(err){
    if(err){
        res.redirect('../errorpage');
    }else{
      res.redirect('../showTasks');
    }
   });
  })
});




module.exports = router;
