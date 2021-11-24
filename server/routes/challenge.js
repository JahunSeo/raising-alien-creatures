const express = require("express");
const router = express.Router();
module.exports = function (pool) {
  // 챌린지 생성 api
  router.post("/create", function (req, res) {
    console.log(req.body);
    const max_user = parseInt(req.body.max_user);
    const cnt_of_week = parseInt(req.body.cnt_of_week);
    if (req.user) {
      pool.getConnection(function (err, connection) {
        connection.query(
          "INSERT INTO Challenge (challengeName, challengeContent, createUserNickName, maxUserNumber, cntOfWeek, tag) VALUES (?, ?, ?, ?, ?, ?)",
          [
            req.body.challenge_name,
            req.body.challenge_content,
            req.user.id,
            max_user,
            cnt_of_week,
            req.body.tag,
          ],
          function (err1, results1) {
            if (err1) {
              console.error(err);
              res.status(200).json({
                result: "fail",
                msg: "cant insert",
              });
              return;
            }
            res.status(200).json({
              result: "success",
              msg: "do insert",
              data: {challenge_id: results1.insertId, total_auth_cnt: cnt_of_week}
            });
            connection.release();
          }
        );
      });
    } else {
      res.status(401).json({
        result: "fail",
        msg: "Unauthorized",
      });
    }
  });

  // 챌린지 total_auth_cnt 보내주기
  router.get("/totalAuthCnt", function (req, res) {
    console.log(res.params.challengeid);
    const max_user = parseInt(req.body.max_user);
    const cnt_of_week = parseInt(req.body.cnt_of_week);
    if (req.user) {
      pool.getConnection(function (err, connection) {
        if (err) {
          console.error(err);
          res.status(500).json({
            result: "fail",
            msg: "cant connection",
          });
          return;
        }
        connection.query(
          "",[],
          function(error, results) {
            if (error) {
              console.error(error);

            }
          }
        )

    })
    } else {
      res.status(401).json({
        result: "fail",
        msg: "Unauthorized",
      });
    }
  });

  // 챌린지 인증 요청
  // Data Type : Front 쪽에서 data JSON Type으로 서버로 전달
  // var data = {user_info_id : 2, Alien_id : 2, Challenge_id : 2, requestUserNickname : 'john', imgURL : 'test_url' comment: 'comment'};
  router.post("/auth", function (req, res) {
    var data = req.body;
    data.request_user = req.user.nickname;
    console.log(req.user.nickname);
    console.log("서버 유저아이디 확인 :", data.user_info_id);
    var sql1 = `INSERT INTO Authentification SET ?;`;
    pool.getConnection(function (err, connection) {
      connection.query(sql1, data, function (error, results, fields) {
        console.log("TESTTEST1");
        if (error) {
          console.error(error);
          res.json({
            result: "fail",
            msg: "Fail to load Information from Database.",
          });
          return;
        }

        // ++추가구현 필요++ 동일한 챌린지의 멤버들이 접속중일 때, 실시간으로 연락이 갈 것. ( 해당 소켓의 room member에게 'msg' )
        console.log(results);
        res.json({ result: "success" });
        // res.redirect('/');
        connection.release();
      });
    });
  });

  router.post("/search", function (req, res) {
    var data = req.body;
    // console.log(data.keyword);
    pool.getConnection(function (err, connection) {
      connection.query(
        `select * from Challenge where challengeName regexp '${data.keyword}'`,
        function (err, results, fields) {
          if (err) {
            console.log(err);
            res.json({
              result: "fail",
              msg: "Fail to search",
            });
            connection.release();
            return;
          }
          res.json({ result: "success", challenge: results });
          connection.release();
        }
      );
    });
  });

  // 챌린지 인증 수락
  // auth data 에 수락표시 is auth 수정
  // alien에 accured auth count / week_auth_cnt 1씩 증가
  router.post("/approval", function (req, res) {
    var data = req.body;
    var auth_id = data.auth_id;
    var Alien_id = data.Alien_id;
    sql1 = `update Authentification set isAuth = isAuth +1 where id=${auth_id};`;
    sql2 = `update Alien set accuredAuthCnt = accuredAuthCnt+1, week_auth_cnt = week_auth_cnt+1 where id = ${Alien_id}`;
    pool.getConnection(function (err, connection) {
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
        connection.release();
      });
    });
  });

  router.use(function (req, res, next) {
    res.status(404).json({
      result: "fail",
      msg: "Sorry cant post that!",
    });
  });
  router.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
      result: "fail",
      msg: "Something broke!",
    });
  });
  return router;
};
