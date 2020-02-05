var express = require('express');
var router = express.Router();
var UsersModel = require('../schema/user_table', '../schema/login_details');

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/', function(req, res, next) {
  res.render('signup');
});

router.post('/', function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var city = req.body.city;
  var phone = req.body.phone;
  var fileobj = req.files.document;
  var filename = fileobj.name;
  var filesize = fileobj.size;
  var filemimetype = fileobj.mimetype;
  var size = 2*1024*1024;
  
  req.session.theme1=name;
  req.session.email=email;
  req.session.password=password;
  req.session.city=city;
  req.session.phone=phone;

  console.log("Name is " + name);
  console.log("Email is " + email);
  console.log("Password is " + password);
  console.log("Phone Number is " + phone);
  console.log("City is " + city);

  if (filesize <= size) 
    {
      if(filemimetype == "image/png")
      {
              fileobj.mv("public/uploads/" + filename, function(err) 
                {
                  if (err)
                    {
                    return res.status(500).send('Hi, your file is not uploaded!');
                    }
                  
                  else
                    {
                      res.redirect('/signup_response');              
                    }
                });
      }
      else
      {
        res.send('File is not in PNG Format');
      }
    }
    else
    {
      res.send('File size is more than 2mb');
    }
});

router.get('/signup_response', function(req, res, next){

  if(req.session.theme1)
  {
    var username = req.session.theme1;
    res.render('signup_response', {myvalue : username});
  }
 else
  {
    res.redirect('/');
  }
});

router.post('/login', function(req, res, next) {
  var name1 = req.body.name;
  var email1 = req.body.email;
  var password1 = req.body.password;

  req.session.theme2=name1;
  req.session.email1=email1;
  req.session.password1=password1;

  console.log("Name is " + name1);
  console.log("Email is " + email1);
  console.log("Password is " + password1);
  
  res.redirect("/login_response");
});

router.get('/login_response', function(req, res, next){

  if(req.session.theme1 != req.session.theme2 || req.session.email != req.session.email1 || req.session.password != req.session.password1)
  {
    var username = "Your ID details not found";
    res.render('login_response', {myvalue : username});
  }
 else
  {
    res.redirect('/homepage');
  }
});

router.get('/homepage', function(req, res, next) {
  var username = req.session.theme2;
  res.render('homepage',{ myvalue : username});
});

router.get('/form', function(req, res, next) {
    var username = req.session.theme2;
    res.render('form',{ value : username});
});

router.post('/form', function(req, res, next) {
  console.log(req.body);

  const mybodydata = {
    name: req.body.name,
    phone: req.body.phone,
    city: req.body.city,
    email: req.body.email
  }

var data = UsersModel(mybodydata);

data.save(function(err){
  if (err){
    console.log("Error in Insert Record");
  }
  else{
    res.redirect('/form');
  }
})
});

router.get('/table', function(req, res, next) 
  {
    var username = req.session.theme2;
  UsersModel.find(function(err,db_users_array)
    {
    if(err)
    {
      console.log("error in fetch data" + err)
    }
    else
    {
      console.log(db_users_array);

      res.render('table', { user_array : db_users_array, myvalue : username});
    }
  })
});

router.get('/edit/:id', function(req,res){
  console.log(req.params.id);
  UsersModel.findById(req.params.id, function(err,db_users_array){
    if(err){
      console.log("Edit fetch error" + err);
    }
    else{
      console.log(db_users_array);

      res.render('edit-form',{ user_array: db_users_array});
    }
  });
});

router.post('/edit/:id', function(req,res){
  console.log("Edit ID is: " + req.params.id);

  const mybodydata = {
    name: req.body.name,
    phone: req.body.phone,
    city: req.body.city,
    email: req.body.email
  }
  UsersModel.findByIdAndUpdate(req.params.id, mybodydata, function(err,db_users_array){
    if(err){
      console.log("Error in Record Update ");
      res.redirect('/table');
    }
    else{
      res.redirect('/table');
    }
  });
});

router.get('/show/:id', function(req,res){
  console.log(req.params.id);
  UsersModel.findById(req.params.id, function(err,db_users_array){
    if(err){
      console.log("error in single record fetch" + err);
    }
    else{
      console.log(db_users_array);

      res.render('record',{ user_array: db_users_array});
    }
  });
});

router.get('/delete/:id', function(req,res){
  UsersModel.findByIdAndDelete(req.params.id, function(err,project){
    if(err){
      console.log("error in record delete" + err);

      res.redirect('/table');
    }
    else{
      console.log("Record Deleted");

      res.redirect('/table');
    }
  });
});
module.exports = router;