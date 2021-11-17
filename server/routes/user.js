const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

var isOwner = (req, res) => {
  if (req.user) {
    return true;
  } else {
    return false;
  }
};

module.exports = function (passport, connection) {
  router.post("/register", (req, res, next) => {
    const data = req.body;
    const email = data.userEmail;
    const password = data.userPassword;
    const encryptedPassword = bcrypt.hashSync(password, 10);
    const nickname = data.userNickname;
    connection.query(
      "INSERT INTO user_info (email, password, nickname) values (?, ?, ?)",
      [email, encryptedPassword, nickname],
      function (err, results) {
        if (err) {
          console.error(err);
          err_handling = err.sqlMessage.split(" ");
          const duplicated_email = err_handling[2];
          res.json({
            result: "fail",
            msg: `${duplicated_email}은(는) 이미 존재하는 이메일 주소입니다.`,
          });
          return;
        }
        console.log(
          "server has registered new user`s information successfully.",
          results
        );
        res.json({ result: "success", msg: "user registered" });
      }
    );
  });

  router.get("/login/confirm", (req, res) => {
    if (req.user) {
      req.user.login = true;
      console.log(req.user);
      res.json(req.user);
    } else {
      const msg = { login: false };
      console.log(msg);
      res.json(msg);
    }
  });

  // TODO: refactor response
  router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) res.json({ result: "fail", msg: "no user" });
      if (!user) res.json({ result: "fail", msg: "login fail" });
      else {
        req.login(user, (err) => {
          if (err) throw err;
          var result = {
            result: "success",
            email: req.user.email,
            nickname: req.user.nickname,
            id: req.user.id,
          };
          res.json(result);
        });
      }
    })(req, res, next);
  });

  // 해당 유저 소유의 Alien / 참가중인 Challenge / 해당유저와 유관한 인증목록 중 인증되지 않은 것들 가져오기
  router.get("/personalinfo", function (req, res) {
    var user_info_id = req.user.id;
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
          res.json({
            result: "fail",
            msg: "Fail to load Information from Database.",
          });

          return;
        }
        var result = {
          result: "success",
          Alien: results[0],
          Alien_dead: results[1],
          Alien_graduated: results[2],
          Challenge: results[3],
          notice: results[4],
        };
        res.json(result);
      }
    );
  });

  //챌린지 어장가기
  router.post("/aquarium/challenge", function (req, res) {
    var get = req.body;
    var challenge_id = get.challenge_id;
    console.log("1212", get);
    let user_id, user_nickname;
    if (req.user) {
      user_id = req.user.id;
      user_nickname = req.user_nickname;
    }
    var sql1 = `select * from Alien where Alien.Challenge_id = ${challenge_id};`;
    var sql2 = `select * from Alien_dead where Alien_dead.Challenge_id = ${challenge_id};`;
    var sql3 = `select * from Alien_graduated where Alien_graduated.Challenge_id=${challenge_id};`;
    connection.query(sql1 + sql2 + sql3, function (error, results, fields) {
      if (error) {
        console.error(error);
        res.json({
          result: "fail",
          msg: "Fail to load Information from Database.",
        });
        return;
      }

      var result = {
        result: "success",
        user: user_id,
        nickname: user_nickname,
        Alien: results[0],
        Alien_dead: results[1],
        Alien_graduated: results[2],
      };

      res.json(result);
    });
  });

  // 챌린지 인증 요청
  // Data Type : Front 쪽에서 data JSON Type으로 서버로 전달
  // var data = {user_info_id : 2, Alien_id : 2, Challenge_if : 2, requestUserNickname : 'john', imgURL : 'test_url'};
  router.post("/aquarium/auth", function (req, res) {
    var data = req.body;
    console.log(data);
    var sql1 = `INSERT INTO Authentification SET ?;`;
    // 동일한 챌린지의 멤버들이 로그인을 했을 때, 화면에 알림표시가 되게 할 것. ( DB 연동 후 데이터 )
    // -> 로그인 성공화면에 해당 기능 추가한다.
    connection.query(sql1, data, function (error, results, fields) {
      if (error) {
        console.error(error);
        res.json({
          result: "fail",
          msg: "Fail to load Information from Database.",
        });
        return;
      }

      // ++추가구현 필요++ 동일한 챌린지의 멤버들이 접속중일 때, 실시간으로 연락이 갈 것. ( 해당 소켓의 room member에게 'msg' )
      // -> connected clients socket list 의 identifier 가 user identifier로 변경되어야 함
      console.log(results);
      res.json({ result: "success" });
      // res.redirect('/');ß
    });
  });

  // 챌린지 인증 수락
  // auth data 에 수락표시 is auth 수정
  // alien에 accured auth count / week_auth_cnt 1씩 증가
  router.post("/aquarium/approved", function (req, res) {
    var data = req.body;
    var auth_id = data.auth_id;
    var Alien_id = data.Alien_id;
    sql1 = `update Authentification set isAuth = isAuth +1 where id=${auth_id};`;
    sql2 = `update Alien set accuredAuthCnt = accuredAuthCnt+1, week_auth_cnt = week_auth_cnt+1 where id = ${Alien_id}`;
    connection.query(sql1 + sql2, function (error, results, fields) {
      if (error) {
        console.error(error);
        res.json({
          result: "fail",
          msg: "Fail to update Database.",
        });
        return;
      }

      console.log(results);
      res.json({ result: "success" });
    });
  });

  router.get("/logout", function (req, res) {
    req.logout();
    req.session.save(function () {
      res.json({ result: "success", msg: "logout success" });
    });
  });

  // router.post('/info_change', function (req, res){
  //     var data = req.body;
  //     var id = data.;
  //     var password = data.;
  //     var nickname = data.;
  //     connection.query()

  // });

  router.get("/:userId", (req, res) => {
    const user_id = req.params.userId;
    try {
      connection.query(
        "(SELECT * FROM Alien JOIN Challenge ON Challenge.id = Alien.Challenge_id WHERE Alien.user_info_id = ?) UNION (SELECT * FROM Alien_graduated JOIN Challenge ON Challenge.id = Alien_graduated.Challenge_id WHERE Alien_graduated.user_info_id = ?)",
        [user_id, user_id],
        function (err, result) {
          res.status(200).json({
            result: "success",
            data: result,
          });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(501).json({
        result: "fail",
        msg: "cant select infomations",
      });
    }
  });

  router.use(function (req, res, next) {
    res.status(404).send("Sorry cant find that!");
  });

  router.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  });

  return router;
};
