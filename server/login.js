const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../.env") });
//미들웨어
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var compression = require("compression");
const cors = require("cors");
var helmet = require("helmet");
app.use(helmet());
var session = require("express-session");
var cookieParser = require("cookie-parser");
var FileStore = require("session-file-store")(session);
var fs = require("fs");
var flash = require("connect-flash");
var bcrypt = require("bcrypt");
const port = 3001;

var isOwner = (req, res) => {
  if (req.user) {
    return true;
  } else {
    return false;
  }
};

// var statusUI = (req, res) => {
//   var authstatusUI = ;
//   if (isOwner(req,res)){
//     authstatusUI = `로그인시 변경될 내용`
//   }
//   return authstatusUI;
// }
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
});
connection.connect();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(cors());
app.use(compression());
app.use(
  session({
    secret: "asadlfkj!@#!@#dfgasdg",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);

app.use(flash()); // 반드시 session 다음에
var passport = require("./lib/passport")(app, connection);
var userRouter = require("./routes/user.js")(passport, connection);
app.use("/api/user", userRouter);

//로그인 성공화면
app.get("/api/aquarium/personal", function (req, res) {
  var user_info_id = req.user;
  var sql1 = `select * from Alien where Alien.user_info_id=${user_info_id};`;
  var sql2 = `select * from Alien_dead where Alien_dead.user_info_id=${user_info_id};`;
  var sql3 = `select * from Alien_graduated where Alien_graduated.user_info_id=${user_info_id};`;
  var sql4 = `select challengeName, challengeContent, createDate, createUserNickName, maxUserNumber, participantNumber, cntOfWeek, Challenge_id from Challenge  inner join user_info_has_Challenge on Challenge.id = user_info_has_Challenge.Challenge_id  inner join user_info on user_info_has_Challenge.user_info_id = user_info.id  where user_info.id = ${user_info_id};`;
  var sql5 = `select * from Authentification inner join user_info_has_Challenge on user_info_has_Challenge.Challenge_id = Authentification.Challenge_id where user_info_has_Challenge.user_info_id = ${user_info_id} and isAuth = 0;`;
  connection.query(
    sql1 + sql2 + sql3 + sql4 + sql5,
    function (error, results, fields) {
      if (error) {
        console.error(error);
      }
      var result = {
        Alien: results[0],
        Alien_dead: results[1],
        Alien_graduated: results[2],
        Challenge: results[3],
        notice: results[4],
      };

      res.send(result);
    }
  );
});

//챌린지 어장가기
app.post("/api/aquarium/challenge", function (req, res) {
  var get = req.body;
  var challenge_id = get.challenge_id;
  console.log("1212", get);
  var user_id = req.user.id;
  var user_nickname = req.user_nickname;
  var sql1 = `select * from Alien where Alien.Challenge_id = ${challenge_id};`;
  var sql2 = `select * from Alien_dead where Alien_dead.Challenge_id = ${challenge_id};`;
  var sql3 = `select * from Alien_graduated where Alien_graduated.Challenge_id=${challenge_id};`;
  connection.query(sql1 + sql2 + sql3, function (error, results, fields) {
    var result = {
      user: user_id,
      nickname: user_nickname,
      Alien: results[0],
      Alien_dead: results[1],
      Alien_graduated: results[2],
    };

    res.send(result);
  });
});

// 챌린지 인증 요청
// Data Type : Front 쪽에서 data JSON Type으로 서버로 전달
// var data = {user_info_id : 2, Alien_id : 2, Challenge_if : 2, requestUserNickname : 'john', imgURL : 'test_url'};
app.post("/api/aquarium/auth", function (req, res) {
  var data = req.body;
  console.log(data);
  var sql1 = `INSERT INTO Authentification SET ?;`;
  // 동일한 챌린지의 멤버들이 로그인을 했을 때, 화면에 알림표시가 되게 할 것. ( DB 연동 후 데이터 )
  // -> 로그인 성공화면에 해당 기능 추가한다.
  connection.query(sql1, data, function (error, results, fields) {
    if (error) {
      console.error(error);
    }
    res.send(완료);
    // ++추가구현 필요++ 동일한 챌린지의 멤버들이 접속중일 때, 실시간으로 연락이 갈 것. ( 해당 소켓의 room member에게 'msg' )
    // -> connected clients socket list 의 identifier 가 user identifier로 변경되어야 함
    // console.log(results);
    // res.redirect('/');ß
  });
});

// 챌린지 인증 수락
// auth data 에 수락표시 is auth 수정
// alien에 accured auth count / week_auth_cnt 1씩 증가
app.post("/api/aquarium/approved", function (req, res) {
  var data = req.body;
  var auth_id = data.auth_id;
  var Alien_id = data.Alien_id;
  sql1 = `update Authentification set isAuth = isAuth +1 where id=${auth_id};`;
  sql2 = `update Alien set accuredAuthCnt = accuredAuthCnt+1, week_auth_cnt = week_auth_cnt+1 where id = ${Alien_id}`;
  connection.query(sql1 + sql2, function (error, results, fields) {
    console.log(results);
    res.send("완료");
  });
});

//update Authentification set isAuth = isAuth +1 where id=${auth_id};
// update Alien set accuredAuthCnt = accuredAuthCnt+1, week_auth_cnt = week_auth_cnt+1 where id = ${Alien_id};

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  console.log("연결성공");
});
