const express = require("express");
const router = express.Router();
const s3 = require("../lib/s3");
module.exports = function (connection) {
  router.get("/", (req, res) => {
    const sql1 = `(SELECT Alien.id, status, challengeName, challengeContent, Alien.Challenge_id, Challenge.createDate, createUserNickName, maxUserNumber, participantNumber, Alien.createDate, alienName, color, accuredAuthCnt, color, graduate_toggle, week_auth_cnt, total_auth_cnt, auth_day, alive_date FROM Alien JOIN Challenge ON Alien.Challenge_id = Challenge.id) UNION (SELECT Alien_graduated.id, status, challengeName, challengeContent, Alien_graduated.Challenge_id, Challenge.createDate, createUserNickName, maxUserNumber, participantNumber, Alien_graduated.createDate, alienName, color, accuredAuthCnt, color, graduate_toggle, week_auth_cnt, total_auth_cnt, auth_day, graduated_date FROM Alien_graduated JOIN Challenge ON Alien_graduated.Challenge_id = Challenge.id) ORDER BY accuredAuthCnt DESC LIMIT 50;`;

    connection.query(sql1, function (error, results) {
      if (error) {
        console.error(error);
        res.status(200).json({
          result: "fail",
          msg: "cant select",
        });
        return;
      }

      res.status(200).json({
        result: "success",
        data: results,
      });
    });
  });

  router.get("/s3Url", async (req, res) => {
    const url = await s3.generateUploadURL();
    res.send({ url });
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
