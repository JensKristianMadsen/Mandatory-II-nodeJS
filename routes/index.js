const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const coon = require('../database/coon');


/* GET home page. */
router.get('/', (req, res, next) => {
if(req.session.flag == 1){
  req.session.destroy();
  res.render('index', { title: 'Mandatory-II-nodeJS.', message : 'Email Already Exists.' , flag : 1});

}else if(req.session.flag == 2){
  req.session.destroy();
  res.render('index', { title: 'Mandatory-II-nodeJS.', message : 'Registration Done. Please Login.' , flag : 0});

}
else if(req.session.flag == 3){
  req.session.destroy();
  res.render('index', { title: 'Mandatory-II-nodeJS.', message : 'Confirm Password Dose Not Match.' , flag : 1});

}else if(req.session.flag == 4){
  req.session.destroy();
  res.render('index', { title: 'Mandatory-II-nodeJS.', message : 'Incorrect Email or Password.' , flag : 1});

}else{
  res.render('index', { title: 'Mandatory-II-nodeJS.'});
}


});

//Handle POST request for User Registration
router.post('/auth_reg', (req, res, next) => {

  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;
  const cpassword = req.body.cpassword;

  if(cpassword == password){

    const sql = 'select * from user where email = ?;';

    coon.query(sql,[email], (err, result, fields) => {
      if(err) throw err;

      if(result.length > 0){
        req.session.flag = 1;
        res.redirect('/');
      }else{

        const hashpassword = bcrypt.hashSync(password, 10);
        const sql = 'insert into user(fullname,email,password) values(?,?,?);';

        coon.query(sql,[fullname,email, hashpassword], (err, result, fields) => {
          if(err) throw err;
          req.session.flag = 2;
          res.redirect('/');
        });
      }
    });
  }else{
    req.session.flag = 3;
    res.redirect('/');
  }
});


//Handle POST request for User Login
router.post('/auth_login', (req,res,next) => {

  const email = req.body.email;
  const password =req.body.password;

  const sql = 'select * from user where email = ?;';
  
  coon.query(sql,[email], (err,result, fields) => {
    if(err) throw err;

    if(result.length && bcrypt.compareSync(password, result[0].password)){
      req.session.email = email;
      res.redirect('/home');
    }else{
      req.session.flag = 4;
      res.redirect('/');
    }
  });
});


//Route For Home Page
router.get('/home', (req, res, next) =>{
  res.render('home', {message : 'Welcome, ' + req.session.email});
});

router.get('/logout',(req,res,next) => {
if(req.session.email){
  req.session.destroy();
}

res.redirect('/');

})

module.exports = router;