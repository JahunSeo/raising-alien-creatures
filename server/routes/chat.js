const express = require("express");
const router = express.Router();

module.exports = function (pool) {
  // read chat messages
  router.get("/:challenge_id", function (req, res) {
    let challenge_id = parseInt(req.params.challenge_id);
    // 1단계: validation check
    if (!challenge_id) {
      res.status(400).json({
        result: "fail",
        msg: "Bad Request: challenge_id should be provided.",
      });
      return;
    }
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      // 2단계: 해당 챌린지의 메시지들을 시간순으로 정렬해 전송
      // - TODO: 최근 n일의 메시지만 1차 전송 후, 스크롤 시 요청 받아 추가 전송하는 방식으로 변경
      connection.query(
        "SELECT * from chat_message where challenge_id=? ORDER BY created_date ASC",
        [challenge_id],
        function (err, results) {
          if (err) throw err;
          res.status(201).json({
            result: "success",
            msg: "select messages",
            data: results,
          });
          connection.release();
          return;
        }
      );
    });
  });

  // add chat message
  router.post("/", function (req, res) {
    console.log(req.body);
    // 1단계: login 상태 확인
    if (!req.user) {
      res.status(401).json({
        result: "fail",
        msg: "Unauthorized",
      });
      return;
    }
    // 2단계: 저장할 값 validation check
    let user_info_id = parseInt(req.user.id);
    let challenge_id = req.body.challenge_id;
    let user_nickname = req.body.user_nickname;
    let time = req.body.time;
    let message = req.body.message;
    console.log(message);
    if (!user_info_id || !challenge_id) {
      res.status(400).json({
        result: "fail",
        msg: "Bad Request: challenge_id should be provided.",
      });
      return;
    }
    pool.getConnection(function (err, connection) {
      if (err) throw err; // not connected!
      // 3단계: user가 challenge에 참가중인지 확인
      connection.query(
        "SELECT * from user_info_has_challenge where user_info_id=? and challenge_id=?",
        [user_info_id, challenge_id],
        function (err, results) {
          if (err) throw err; // server error!
          if (results.length <= 0) {
            res.status(403).json({
              result: "fail",
              msg: "Forbidden",
            });
            connection.release();
            return;
          }
          // 4단계: message 추가
          connection.query(
            "INSERT INTO chat_message SET ?",
            {
              user_info_id,
              challenge_id,
              user_nickname,
              message,
              time,
            },
            function (err, results) {
              if (err) throw err; // server error!
              res.status(201).json({
                result: "success",
                msg: "do insert",
              });
              connection.release();
              return;
            }
          );
        }
      );
    });
  });

  // https://davidburgos.blog/how-to-handle-404-and-500-errors-on-expressjs/
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
      msg: "Something broken!",
    });
  });

  return router;
};
