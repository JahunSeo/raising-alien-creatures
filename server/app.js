const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const mysql = require("mysql");
/* log in middleware */
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const fs = require('fs');
const flash = require('connect-flash');
const schedule = require('node-schedule');

app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "localhost:3000");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
  next();
})

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements : true
});
connection.connect();


/**/
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(compression());
app.use(helmet());
app.use(session({
  secret: 'asadlfkj!@#!@#dfgasdg',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

app.use(cors());
app.use(flash()); // 반드시 session 다음에
const passport = require('./lib/passport')(app, connection);
const userRouter = require('./routes/user.js')(passport, connection);
const challengeRouter = require('./routes/challenge.js')(connection);
const alienRouter = require('./routes/alien.js')(connection);
app.use('/api/user', userRouter);
app.use('/api/challenge', challengeRouter);
app.use('/api/alien', alienRouter);
/*************/

app.use(express.json()); // middleware for parsing application/json
app.use(express.urlencoded({ extended: false })); // middleware for parsing application/x-www-form-urlencoded
app.use(cookieParser()); // middleware for parsing cookie
app.use(morgan("dev")); // middleware for logging HTTP request


/************************************/
var isOwner = (req,res) => {
  if (req.user){ return true;}
  else { return false;}
}

/**login api**/


//로그인 성공화면
app.get('/api/aquarium/personal', function(req,res){
  var user_info_id = req.user.id;
  var sql1 = `select * from Alien where Alien.user_info_id=${user_info_id};`;
  var sql2 = `select * from Alien_dead where Alien_dead.user_info_id=${user_info_id};`;
  var sql3 = `select * from Alien_graduated where Alien_graduated.user_info_id=${user_info_id};`;
  var sql4 = `select challengeName, challengeContent, createDate, createUserNickName, maxUserNumber, participantNumber, cntOfWeek, Challenge_id from Challenge  inner join user_info_has_Challenge on Challenge.id = user_info_has_Challenge.Challenge_id  inner join user_info on user_info_has_Challenge.user_info_id = user_info.id  where user_info.id = ${user_info_id};`;
  var sql5 = `select * from Authentification inner join user_info_has_Challenge on user_info_has_Challenge.Challenge_id = Authentification.Challenge_id where user_info_has_Challenge.user_info_id = ${user_info_id} and isAuth = 0;`;
  connection.query(sql1+sql2+sql3+sql4+sql5, function(error,results,fields){
  if (error){
    console.error(error);
  }
  var result = { Alien : results[0], Alien_dead : results[1], Alien_graduated : results[2], Challenge : results[3], notice : results[4]};
  
  res.send(result);
  });
});

//챌린지 어장가기
app.post('/api/aquarium/challenge', function(req,res){
  var get = req.body;
  var challenge_id = get.challenge_id;
  console.log('1212',get);
  var user_id = req.user.id;
  var user_nickname = req.user_nickname;
  var sql1 = `select * from Alien where Alien.Challenge_id = ${challenge_id};`;
  var sql2 = `select * from Alien_dead where Alien_dead.Challenge_id = ${challenge_id};`;
  var sql3 = `select * from Alien_graduated where Alien_graduated.Challenge_id=${challenge_id};`;
  connection.query(sql1+sql2+sql3, function(error,results,fields){
  var result = { user : user_id, nickname : user_nickname, Alien : results[0], Alien_dead : results[1], Alien_graduated : results[2]};
  
  res.send(result);
  })
});


// 챌린지 인증 요청
// Data Type : Front 쪽에서 data JSON Type으로 서버로 전달 
// var data = {user_info_id : 2, Alien_id : 2, Challenge_if : 2, requestUserNickname : 'john', imgURL : 'test_url'};
app.post('/api/aquarium/auth', function(req,res){
  var data = req.body;
  console.log(data);
  var sql1 = `INSERT INTO Authentification SET ?;`;
  // 동일한 챌린지의 멤버들이 로그인을 했을 때, 화면에 알림표시가 되게 할 것. ( DB 연동 후 데이터 ) 
  // -> 로그인 성공화면에 해당 기능 추가한다. 
  connection.query(sql1, data, function(error, results, fields){
    if (error){
      console.error(error);
    }
    res.send(완료);
    // ++추가구현 필요++ 동일한 챌린지의 멤버들이 접속중일 때, 실시간으로 연락이 갈 것. ( 해당 소켓의 room member에게 'msg' )
    // -> connected clients socket list 의 identifier 가 user identifier로 변경되어야 함 
    // console.log(results);
    // res.redirect('/');ß
  })
});

// 챌린지 인증 수락
// auth data 에 수락표시 is auth 수정
// alien에 accured auth count / week_auth_cnt 1씩 증가
app.post('/api/aquarium/approved', function(req, res){
  var data = req.body;
  var auth_id = data.auth_id;
  var Alien_id = data.Alien_id;
  sql1 = `update Authentification set isAuth = isAuth +1 where id=${auth_id};`
  sql2 = `update Alien set accuredAuthCnt = accuredAuthCnt+1, week_auth_cnt = week_auth_cnt+1 where id = ${Alien_id}`
  connection.query(sql1+sql2, function (error, results, fields) {
    console.log(results);
    res.send('완료');
  })
});

/***********/

// 생명체 사망 api and 졸업 api
const j = schedule.scheduleJob({hour: 00, minute: 00}, function() {
  let today = new Date();
  let day = today.getDay();
  console.log(day);
  connection.query('INSERT INTO Alien_dead SELECT * FROM Alien where week_auth_cnt < total_auth_cnt AND (auth_day = 7 OR auth_day = ?)', [day], function(err, results){
      if (err) {
          console.error(err);
      }
      console.log('success insert dead_alien!!!!!!!!!', results);
  });
  connection.query('INSERT INTO dead_authentification SELECT Authentification.id, Authentification.user_info_id, Alien_id, Authentification.Challenge_id, requestDate, responseDate, requestUserNickname, responseUserNickname, isAuth, imgURL FROM Authentification LEFT JOIN Alien ON Alien.id = Authentification.Alien_id where week_auth_cnt < total_auth_cnt AND (auth_day = 7 OR auth_day = ?)', [day], function(err, results){
      if (err) {
          console.error(err);
      }
      console.log('success insert dead_authentification!!!!!!!!!', results);
  });
  connection.query('DELETE FROM Authentification USING Alien LEFT JOIN Authentification ON Alien.id = Authentification.Alien_id where week_auth_cnt < total_auth_cnt AND (auth_day = 7 OR auth_day = ?)', [day], function(err, results){
      if (err) {
          console.error(err);
      }
      console.log('success delete authentification!!!!!!!!!', results);
  });
  connection.query('DELETE FROM Alien where week_auth_cnt < total_auth_cnt AND (auth_day = 7 OR auth_day = ?)', [day], function(err, results){
      if (err) {
          console.error(err);
      }
      console.log('success delete Alien!!!!!!!!!', results);
  });
  connection.query('UPDATE Alien SET week_auth_cnt = 0 where auth_day = 7 OR auth_day = ?', [day], function(err, results){
      if (err) {
          console.error(err);
      }
      console.log('success update Alien!!!!!!!!!', results);
  });
  
  // 졸업 API
  connection.query('INSERT INTO Alien_graduated SELECT * FROM Alien where graduate_toggle = 1 AND (auth_day = 7 OR auth_day = ?)', [day], function(err, results) {
      if (err) {
          console.error(err);
      }
      console.log('success insert graduated_alien!!!!!!!!!', results);
  });
  connection.query('INSERT INTO graduated_authentification SELECT Authentification.id, Authentification.user_info_id, Alien_id, Authentification.Challenge_id, requestDate, responseDate, requestUserNickname, responseUserNickname, isAuth, imgURL FROM Authentification LEFT JOIN Alien ON Alien.id = Authentification.Alien_id where graduate_toggle = 1 AND (auth_day = 7 OR auth_day = ?)', [day], function(err, results)  {
      if (err) {
          console.error(err);
      }
      console.log('success insert graduated_authentification!!!!!!!!!', results);
  });
  connection.query('DELETE FROM Authentification USING Alien LEFT JOIN Authentification ON Alien.id = Authentification.Alien_id where graduate_toggle = 1 AND (auth_day = 7 OR auth_day = ?)', [day], function(err, results){
      if (err) {
          console.error(err);
      }
      console.log('success delete authentification!!!!!!!!!', results);
  });
  connection.query('DELETE FROM Alien where graduate_toggle = 1 AND (auth_day = 7 OR auth_day = ?)', [day], function(err, results) {
      if (err) {
          console.error(err);
      }
      console.log('success delete Alien!!!!!!!!!', results);
  });
});


/***********/



// GET test
app.get("/api/test", (req, res) => {
  connection.query("SELECT * FROM topic", function (error, results, fields) {
    if (error) {
      console.log(error);
    }
    res.status(200).json({
      msg: "(API TEST GET) Hello, Alien!",
      body: Math.random(),
      data: results,
    });
  });
});

// PUT test with params
app.put("/api/test/:dummy_id", (req, res) => {
  res.status(200).json({
    msg: `(API TEST PUT) You sent params '${JSON.stringify(
      req.params
    )}' and body '${JSON.stringify(req.body)}'`,
    params: req.params,
    body: req.body,
  });
});

// POST test
app.post("/api/test", (req, res) => {
  res.status(200).json({
    msg: `(API TEST POST) You sent post data '${JSON.stringify(req.body)}'`,
    body: req.body,
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`** Raising Alien Creatures Web Server **`);
  console.log(`App listening on port ${port}`);
  console.log(`DB_NAME: ${process.env.DB_NAME}`);
});
