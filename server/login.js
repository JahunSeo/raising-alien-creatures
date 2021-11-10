// const path = require('path');
// const dotenv = require("dotenv");
// dotenv.config({ path: path.join(__dirname, "../.env") });
//미들웨어 
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');
app.use(helmet());
var session = require('express-session');
var cookieParser = require('cookie-parser');
var FileStore = require('session-file-store')(session);
var fs = require('fs');
var flash = require('connect-flash');
var bcrypt = require('bcrypt');
const port = 3001


var isOwner = (req,res) => {
  if (req.user){ return true;}
  else { return false;}
}

// var statusUI = (req, res) => { 
//   var authstatusUI = ; 
//   if (isOwner(req,res)){
//     authstatusUI = `로그인시 변경될 내용`
//   }
//   return authstatusUI;
// }


// /* MYSQL MYSQL MYSQL MYSQL MYSQL MYSQL MYSQL MYSQL MYSQL MYSQL MYSQL MYSQL MYSQL */ 
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'database-1.cx5rraglozur.ap-northeast-2.rds.amazonaws.com',
  user     : 'admin',
  password : 'wpdk1111',
  database : 'testlogin'
});
connection.connect();

/* MYSQL MYSQL MYSQL MYSQL MYSQL MYSQL MYSQL MYSQL MYSQL MYSQL MYSQL MYSQL MYSQL */

app.use(bodyParser.urlencoded({
    extended: false
  }));

app.use(compression());
app.use(session({
    secret: 'asadlfkj!@#!@#dfgasdg',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
  }));
app.use(flash());   //세션 다음에 할 것 미들웨어는 실행순서가 중요하다.



/* TEST용 삭제예정 */
var authData = {
  email: 'kjy@kjy.net',
  password: '111111',
  nickname: 'kjy'
};
/* TEST용 삭제예정 */


/******* Passport init *****/
var passport = require('passport')    // passport 모듈 include 
const LocalStrategy = require('passport-local').Strategy;  // local 에서 Id / 비밀번호로 로그인

app.use(passport.initialize());  // passport 미들웨어 설치.
app.use(passport.session());     // passport & session 


// app.use((req, res, next) => {
//     console.log(req.session);
//     console.log(req.user);
//     next();
// })

passport.serializeUser(function (user, done) { //로그인 성공을 세션에 저장
  // console.log('serializeUser', user);
    done(null, user.email); 
});

passport.deserializeUser(function (id, done) { //모든 페이지에 접근할 때마다 deserializeUser함수가 실행됨
  // console.log('deserializeUser', id);
  done(null, authData);  // user에게 authdata 가 전달된다 -> 식별자 기반으로 app에 사용할 데이터
});

//MY SQL로 바꾸기
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'pwd'
    },
    function (username, password, done){
      connection.query('select * from usrlist where email=?', [username], function(error,results,fields){
        console.log(results[0].email);
        console.log(username);
        console.log(results[0].pwd);
        console.log(password);

        if (username === results[0].email) {
          console.log(1);
          if (password == results[0].pwd) {
            console.log(2);
              return done(null, results[0], {   //login 성공시 serializeUser의 callback의 user인자로 authData전달
                  message: 'Welcome.'
              });
          } else {
            console.log(3);
              return done(null, false, {
                  message: 'Incorrect password.'
              });
          }
      } else {
        console.log(4);
          return done(null, false, {
              message: 'Incorrect username.'
          });}
      })}
    ));

  

app.get('/', function(req, res){
    console.log('/', req.user);
    res.sendFile(__dirname+'/login.html');
});
        
app.get('/login', function(req,res){
  res.redirect('/');
})


// app.post('/login_process', 
// passport.authenticate('local', {
//     successRedirect: '/',         
//     failureRedirect: '/',
//     failureFlash: true 
// }));


app.post('/login_process', 
passport.authenticate('local', {
    // successRedirect: '/',         
    failureRedirect: '/', failureFlash: true }),
    function(req,res){
      req.session.save(function(){
        res.redirect('/');
      })
    });


app.get('/logout', function (req, res) {
  req.logout();
  req.session.save(function () {
  res.redirect('/');
  });
});


  


// app.use(function (req, res, next) {
//     res.status(404).send('Sorry cant find that!');
//   });
  
//   app.use(function (err, req, res, next) {
//     console.error(err.stack)
//     res.status(500).send('Something broke!')
//   });



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    console.log('연결성공');
  });
  
  