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
    let sql = `SELECT challenge_id as id FROM user_info_has_challenge \
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
        let columns = `alien.id, challenge_id, alien.created_date as created_date,\
                  alien_name as alien_name, color, accumulated_count as accumulated_count, image_url,\
                  practice_status, end_date, alien_status,\
                  alien.times_per_week as times_per_week, sun, mon, tue, wed, thu, fri, sat,\
                  user_info_id,\
                  challenge_name as challenge_name, description as description,\
                  maximum_number as maximum_number, participant_number as participant_number,\
                  challenge.created_date as challenge_created_date`;
        let sql = `SELECT ${columns} FROM alien LEFT JOIN challenge \
              ON alien.challenge_id=challenge.id \
              WHERE alien.user_info_id=${userId} AND (alien.alien_status=0 OR alien.alien_status=1);`;
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
  //확인완료
  router.get("/approval/list", (req, res) => {
    const user_id = req.user.id;
    pool.getConnection(function (err, connection) {
      connection.query(
        'SELECT practice_record.id AS practice_record_id, alien_id, practice_record.challenge_id, practice_record.user_info_id AS request_user_id, challenge.challenge_name AS challenge_name, request_user, request_date, response_user_id, response_user, response_date, record_status, image_url, comments, challenge.tag AS category from practice_record inner join user_info_has_challenge on user_info_has_challenge.challenge_id = practice_record.challenge_id INNER JOIN challenge ON user_info_has_challenge.challenge_id = challenge.id where user_info_has_challenge.user_info_id = ? AND practice_record.user_info_id != ? AND record_status =0 AND DATE_FORMAT(practice_record.request_date, "%Y-%m-%d") = CURDATE() ORDER BY practice_record.request_date DESC',
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
