const express = require("express");
const router = express.Router();
const s3 = require("../lib/s3");
module.exports = function (pool) {
  router.get("/", (req, res) => {
    // const sql1 = `(SELECT Alien.id, status, challengeName, challengeContent, Alien.Challenge_id, Challenge.createDate, createUserNickName, maxUserNumber, participantNumber, Alien.createDate, alienName, image_url, accuredAuthCnt, color, end_date FROM Alien JOIN Challenge ON Alien.Challenge_id = Challenge.id) UNION (SELECT Alien_graduated.id, status, challengeName, challengeContent, Alien_graduated.Challenge_id, Challenge.createDate, createUserNickName, maxUserNumber, participantNumber, Alien_graduated.createDate, alienName, image_url, accuredAuthCnt, color, graduated_date FROM Alien_graduated JOIN Challenge ON Alien_graduated.Challenge_id = Challenge.id) ORDER BY accuredAuthCnt DESC LIMIT 50;`;
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      let columns = `T.id AS id, challenge_id, T.created_date AS created_date, alien_name, color, accumulated_count, \
                    T.image_url AS image_url, practice_status, end_date, alien_status, times_per_week, \
                    sun, mon, tue, wed, thu, fri, sat, user_info_id, email, nickname AS user_nickname, \
                    challenge_name, description, maximum_number, participant_number, \
                    challenge.created_date AS challenge_created_date`;
      
      let alien_table_columns = `id, challenge_id, created_date, user_info_id, alien_name, color, accumulated_count, \
                                image_url, practice_status, end_date, alien_status, sun, mon, tue, wed, thu, fri, sat, \
                                ROW_NUMBER() OVER (PARTITION BY challenge_id ORDER BY accumulated_count DESC) AS RankNo`;
      

      let sql = `SELECT ${columns} FROM (SELECT ${alien_table_columns} FROM alien) T \
                JOIN user_info ON T.user_info_id = user_info.id \
                JOIN challenge ON T.challenge_id = challenge.id\
                WHERE RankNo = 1 AND alien_status = 0 LIMIT 50;`;
      
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
