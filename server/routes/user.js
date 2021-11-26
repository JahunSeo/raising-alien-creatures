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

module.exports = function (passport, pool) {
  router.post("/register", (req, res, next) => {
    const data = req.body;
    const email = data.userEmail;
    const password = data.userPassword;
    const encryptedPassword = bcrypt.hashSync(password, 10);
    const nickname = data.userNickname;
    pool.getConnection(function (err, connection) {
      connection.query(
        "INSERT INTO user_info (email, password, nickname) values (?, ?, ?)",
        [email, encryptedPassword, nickname],
        function (err, results) {
          if (err) {
            console.error("at the user api", err);
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
          connection.release();
        }
      );
    });
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

  // TODO: 아래의 personalinfo api와 통합 가능 여부 체크
  router.get("/challenges/ids", function (req, res) {
    // 1단계: 로그인한 유저인지 확인
    if (!req.user) {
      res.status(401).json({
        result: "fail",
        msg: "Unauthorized",
      });
      return;
    }
    // 2단계: challenges 가져오기
    let sql = `SELECT Challenge_id FROM user_info_has_Challenge \
              WHERE user_info_id=${req.user.id};`;
    pool.getConnection(function (err, connection) {
      connection.query(sql, function (err, results) {
        if (err) throw err;
        res.status(200).json({
          result: "success",
          msg: "request user's challenge ids",
          challenges: results,
        });
        connection.release();
        return;
      });
    });
  });

  // 해당 유저 소유의 Alien / 참가중인 Challenge / 해당유저와 유관한 인증목록 중 인증되지 않은 것들 가져오기
  router.get("/personalinfo", function (req, res) {
    var user_info_id = req.user.id;
    var sql1 = `select * from Alien where Alien.user_info_id=${user_info_id};`;
    var sql2 = `select * from Alien_dead where Alien_dead.user_info_id=${user_info_id};`;
    var sql3 = `select * from Alien_graduated where Alien_graduated.user_info_id=${user_info_id};`;
    var sql4 = `select challengeName, challengeContent, createDate, createUserNickName, maxUserNumber, participantNumber, cntOfWeek, Challenge_id from Challenge inner join user_info_has_Challenge on Challenge.id = user_info_has_Challenge.Challenge_id  inner join user_info on user_info_has_Challenge.user_info_id = user_info.id  where user_info.id = ${user_info_id};`;
    var sql5 = `select * from Authentification inner join user_info_has_Challenge on user_info_has_Challenge.Challenge_id = Authentification.Challenge_id where user_info_has_Challenge.user_info_id = ${user_info_id} and isAuth = 0;`;
    pool.getConnection(function (err, connection) {
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
      connection.release();
    });
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
    pool.getConnection(function (err, connection) {
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
        connection.release();
      });
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
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      // 1단계: user 정보 가져오기
      const { userId } = req.params;
      // TODO: 테이블 수정 후 간소화하기
      let columns = `*`;
      let sql = `SELECT ${columns} FROM user_info WHERE user_info.id=${userId};`;
      connection.query(sql, function (err, results) {
        if (err) throw err;
        const user = results[0];
        if (!user) {
          res.status(400).json({
            result: "fail",
            msg: `user ${userId} not found`,
          });
          connection.release();
          return;
        }
        // 2단계: user에 포함된 alien들 가져오기
        let columns = `Alien.id, Challenge_id, Alien.createDate as create_date,\
                  alienName as alien_name, color, accuredAuthCnt as accured_auth_cnt, image_url,\
                  practice_status, end_date, status,\
                  time_per_week, sun, mon, tue, wed, thu, fri, sat,\
                  user_info_id,\
                  challengeName as challenge_name, challengeContent as challenge_content,\
                  maxUserNumber as max_user_number, participantNumber as participant_number,\
                  Challenge.createDate as challenge_create_date, cntOfWeek as cnt_of_week`;
        let sql = `SELECT ${columns} FROM Alien LEFT JOIN Challenge \
              ON Alien.Challenge_id=Challenge.id \
              WHERE Alien.user_info_id=${userId} AND (Alien.status=0 OR Alien.status=1);`;

        connection.query(sql, function (err, results) {
          if (err) throw err;
          results.forEach((alien) => {
            alien.user_info_id = user.id;
            alien.user_nickname = user.nickname;
          });
          res.status(200).json({
            result: "success",
            user: user,
            aliens: results,
          });
          connection.release();
        });
      });
    });
  });

  router.get("/approval/list", (req, res) => {
    const user_id = req.user.id;
    pool.getConnection(function (err, connection) {
      connection.query(
        "SELECT Authentification.id AS authentification_id, alien_id, Authentification.challenge_id, Authentification.user_info_id AS request_user_id, Challenge.challengeName AS challenge_name, request_user_nickname, request_date, response_user_id, response_user_nickname, response_date, isAuth, image_url, comments from Authentification inner join user_info_has_Challenge on user_info_has_Challenge.Challenge_id = Authentification.Challenge_id INNER JOIN Challenge ON user_info_has_Challenge.Challenge_id = Challenge.id where user_info_has_Challenge.user_info_id = ? AND Authentification.user_info_id != ? AND isAuth=0 ORDER BY Authentification.request_date DESC",
        [user_id, user_id],
        function (err, result) {
          if (err) {
            console.error(err);
            res.status(200).json({
              result: "fail",
              msg: "cant select infomations",
            });
            return;
          }

          res.status(200).json({
            result: "success",
            data: result,
          });
        }
      );
      connection.release();
    });
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
