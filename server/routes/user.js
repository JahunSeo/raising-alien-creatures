const express = require("express");
const router = express.Router();

module.exports = function (passport, connection) {
  // router.post(
  //   "/login_process",
  //   passport.authenticate("local", {
  //     // successRedirect: '/',
  //     failureRedirect: "/api/user/qwwee",
  //     failureFlash: true,
  //   }),
  //   function (req, res) {
  //     console.log("/login_process", req.body);
  //     req.session.save(function () {
  //       res.json({ msg: "success", data: req.body });
  //       // res.redirect("/api/user/aquarium");
  //     });
  //   }
  // );

  // TODO: refactor response
  router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) res.json({ msg: "fail" });
      if (!user) res.json({ msg: "no user" });
      else {
        req.login(user, (err) => {
          if (err) throw err;
          console.log(req.user);
          res.json({ msg: "success" });
        });
      }
    })(req, res, next);
  });

  //로그인 성공화면
  router.get("/aquarium", function (req, res) {
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
  router.post("/aquarium/challenge", function (req, res) {
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
  router.post("/aquarium/auth", function (req, res) {
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
  router.post("/aquarium/approved", function (req, res) {
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

  router.get("/logout", function (req, res) {
    req.logout();
    req.session.save(function () {
      res.redirect("/api/user/");
    });
  });

  // router.post('/info_change', function (req, res){
  //     var data = req.body;
  //     var id = data.;
  //     var password = data.;
  //     var nickname = data.;
  //     connection.query()

  // });

  router.use(function (req, res, next) {
    res.status(404).send("Sorry cant find that!");
  });

  router.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  });

  return router;
};
