const express = require("express");
const router = express.Router();

module.exports = function (pool) {
  // add chat message
  router.post("/create", function (req, res) {
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
    let challenge_id = parseInt(req.body.challenge_id);
    let msg_text = req.body.msg_text;
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
        [req.user.id, req.body.challenge_id],
        function (err, results) {
          if (err) throw err; // server error!
          if (results.length <= 0) {
            res.status(403).json({
              result: "fail",
              msg: "Forbidden",
            });
            return;
          }
          // 4단계: message 추가
          connection.query(
            "INSERT INTO chat_message SET ?",
            {
              user_info_id,
              challenge_id,
              msg_text,
            },
            function (err, results) {
              if (err) throw err; // server error!
              res.status(201).json({
                result: "success",
                msg: "do insert",
              });
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
