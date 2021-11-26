const express = require("express");
const router = express.Router();
const s3 = require("../lib/s3");
module.exports = function (pool) {
  router.get("/", (req, res) => {
    // const sql1 = `(SELECT Alien.id, status, challengeName, challengeContent, Alien.Challenge_id, Challenge.createDate, createUserNickName, maxUserNumber, participantNumber, Alien.createDate, alienName, image_url, accuredAuthCnt, color, end_date FROM Alien JOIN Challenge ON Alien.Challenge_id = Challenge.id) UNION (SELECT Alien_graduated.id, status, challengeName, challengeContent, Alien_graduated.Challenge_id, Challenge.createDate, createUserNickName, maxUserNumber, participantNumber, Alien_graduated.createDate, alienName, image_url, accuredAuthCnt, color, graduated_date FROM Alien_graduated JOIN Challenge ON Alien_graduated.Challenge_id = Challenge.id) ORDER BY accuredAuthCnt DESC LIMIT 50;`;
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      let columns = `alien.id, challenge_id, alien.created_date as alien_created_date,\
                  alien_name, color, accumulated_count, image_url,\
                  practice_status, end_date, alien_status,\
                  alien.times_per_week as times_per_week, sun, mon, tue, wed, thu, fri, sat,\
                  user_info_id, email, nickname as user_nickname,\
                  challenge_name, description,\
                  maximum_number, participant_number,\
                  challenge.created_date as challenge_created_date`;
      let sql = `SELECT ${columns} FROM alien\
           LEFT JOIN user_info ON alien.user_info_id=user_info.id\
           LEFT JOIN challenge ON alien.challenge_id=challenge.id\
           WHERE alien.alien_status=0\
           ORDER BY accumulated_count DESC LIMIT 50;`;
      connection.query(sql, function (err, results) {
        if (err) throw err;
        res.status(200).json({
          result: "success",
          msg: `request main page aliens`,
          aliens: results,
        });
        connection.release();
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
