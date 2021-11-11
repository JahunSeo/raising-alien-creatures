const path = require('path');
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../.env") });
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
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements : true
});
connection.connect();


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
app.use(flash()); // 반드시 session 다음에
var passport = require('./lib/passport')(app, connection);
var userRouter =require('./routes/user.js')(passport);
app.use('/api/user', userRouter);




//로그인 성공화면
app.get('/api/aquarium/personal', function(req,res){
  var user_info_id = req.user.id;
  var sql1 = `select * from Alien where Alien.user_info_id=${user_info_id};`;
  var sql2 = `select * from Alien_dead where Alien_dead.user_info_id=${user_info_id};`;
  var sql3 = `select * from Alien_graduated where Alien_graduated.user_info_id=${user_info_id};`;
  var sql4 = `select challengeName, challengeContent, createDate, createUserNickName, maxUserNumber, participantNumber, cntOfWeek, Challenge_id from Challenge  inner join user_info_has_Challenge on Challenge.id = user_info_has_Challenge.Challenge_id  inner join user_info on user_info_has_Challenge.user_info_id = user_info.id  where user_info.id = ${user_info_id};`;
  
  connection.query(sql1+sql2+sql3+sql4, function(error,results,fields){
  if (error){
    console.error(error);
  }
  var result = { Alien : results[0], Alien_dead : results[1], Alien_graduated : results[2], Challenge : results[3]};
  res.send(result);
  });
})

//챌린지 어장가기
app.get('/api/aquarium/challenge', function(req,res){
  var get = req.body;
  var challenge_id = get.challenge_id;
  
  var user_id = req.user.id;
  var user_nickname = req.user_nickname;
  var sql1 = `select * from Alien where Alien.Challenge_id = ${challenge_id};`;
  var sql2 = `select * from Alien_dead where Alien_dead.Challenge_id = ${challenge_id};`;
  var sql3 = `select * from Alien_graduated where Alien_graduated.Challenge_id=${challenge_id};`;
  connection.query(sql1+sql2+sql3, function(error,results,fields){
  var result = { user : user_id, nickname : user_nickname, Alien : results[0], Alien_dead : results[1], Alien_graduated : results[2]};
  
  res.send(result);
  })
})

// 인증 
// Data Type : Front 쪽에서 data JSON Type으로 전달 
// 현재 DB까지 구현
// 알림기능 추가할 것.
// var data = {user_info_id : 2, Alien_id : 2, requestUserNickname : 'john', imgURL : 'test_url'};
app.post('/api/aquarium/auth', function(req,res){
  var data = req.body;
  // console.log(req.body);
  var sql = `INSERT INTO Authentification SET ?;` 
  connection.query(sql, data, function(error, results, fields){
    if (error){
      console.error(error);
    }
    // Alarm Logic 
    console.log(results);
    // res.redirect('/');
  })
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    console.log('연결성공');
  });