const express = require("express");
const router = express.Router();
module.exports = function (connection) {
  // 챌린지 생성 api
  router.post("/create", function (req, res) {
    console.log(req.body);
    const max_user = parseInt(req.body.max_user);
    const cnt_of_week = parseInt(req.body.cnt_of_week);
    const life = parseInt(req.body.life);
    if (req.user) {
        connection.query(
          "INSERT INTO Challenge (challengeName, challengeContent, createUserNickName, maxUserNumber, cntOfWeek, life) VALUES (?, ?, ?, ?, ?, ?)",
          [
            req.body.challenge_name,
            req.body.challenge_content,
            req.user.nickname,
            max_user,
            cnt_of_week,
            life,
          ],
          function (err1, results1) {
            if (err1) {
              console.error('at the challenge create api', err);
              res.status(200).json({
                result: "fail",
                msg: "cant insert",
              });
              return;
            }
            res.status(200).json({
              result: "success",
              msg: "do insert",
              data: results1.insertId,
            });
          }
        );
    } else {
      res.status(401).json({
        result: "fail",
        msg: "Unauthorized",
      });
    }
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
