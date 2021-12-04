const express = require("express");
const router = express.Router();
module.exports = function (pool, rdsClient) {
  router.get("/:challengeId", function (req, res) {
    console.log("/challenge/:challengeId", req.params.challengeId);
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      // 1단계: challenge 정보 가져오기
      const { challengeId } = req.params;
      // TODO: 테이블 수정 전 임시로 column명 변경해둔 것 간결하게 구성하기
      let columns = `id, challenge_name, description,\
                    maximum_number, participant_number,\
                    created_date, times_per_week`;
      let sql = `SELECT ${columns} FROM challenge WHERE challenge.id=${challengeId};`;
      connection.query(sql, function (err, results) {
        if (err) throw err;
        const challenge = results[0];
        if (!challenge) {
          res.status(400).json({
            result: "fail",
            msg: `challenge ${req.params.challengeId} not found`,
          });
          connection.release();
          return;
        }
        // 2단계: challenge에 포함된 alien들 가져오기
        // 1안 (현재): alien table과 user_info table을 join
        // 2안: alien table과 user_info_has_challange table, user_info table 각각에서 쿼리 수행 후 병합
        // TODO: 테이블 수정 전 임시로 column명 변경해둔 것 간결하게 구성하기
        let columns = `alien.id, challenge_id, created_date,\
                    alien_name, color, accumulated_count, image_url,\
                    practice_status, end_date, alien_status,\
                    times_per_week, sun, mon, tue, wed, thu, fri, sat,\
                    user_info_id, email, nickname as user_nickname`;
        let sql = `SELECT ${columns} FROM alien LEFT JOIN user_info \
                ON alien.user_info_id=user_info.id \
                WHERE alien.challenge_id=${challengeId} AND alien.alien_status=0;`;

        connection.query(sql, function (err, results) {
          if (err) throw err;
          results.forEach((alien) => {
            alien.challenge_name = challenge.challenge_name;
          });
          res.status(200).json({
            result: "success",
            msg: `request challengeId ${req.params.challengeId}`,
            challenge: challenge,
            aliens: results,
          });
          connection.release();
        });
      });
    });
  });

  router.get("/:challengeId/info", function (req, res) {
    console.log("/challenge/:challengeId/info", req.params.challengeId);
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      // 1단계: challenge 정보 가져오기
      const { challengeId } = req.params;
      let columns = `id, challenge_name, description,\
                    maximum_number, participant_number, created_date, times_per_week`;
      let sql = `SELECT ${columns} from challenge WHERE challenge.id=${challengeId};`;
      connection.query(sql, function (err, results) {
        if (err) throw err;
        const challenge = results[0];
        if (!challenge) {
          res.status(400).json({
            result: "fail",
            msg: `challenge ${req.params.challengeId} not found`,
          });
          connection.release();
          return;
        }
        res.status(200).json({
          result: "success",
          msg: `request challengeId info ${req.params.challengeId}`,
          challenge: challenge,
        });
        connection.release();
        return;
      });
    });
  });

  // 챌린지 생성 api
  router.post("/create", function (req, res) {
    console.log(req.body);
    console.log(req.user);
    const max_user = parseInt(req.body.max_user);
    const cnt_of_week = parseInt(req.body.cnt_of_week);
    if (req.user) {
      pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(
          "INSERT INTO challenge (challenge_name, description, created_by, maximum_number, times_per_week, tag, img_url, user_nickname) VALUES (?, ?, ?, ?, ?, ?,?,?)",
          [
            req.body.challenge_name,
            req.body.challenge_content,
            req.user.id,
            max_user,
            cnt_of_week,
            req.body.tag,
            req.body.image_url,
            req.user.nickname,
          ],
          function (err1, results1) {
            if (err1) {
              console.error(err1);
              res.status(200).json({
                result: "fail",
                msg: "cant insert",
              });
              return;
            }
            res.status(200).json({
              result: "success",
              msg: "do insert",
              data: {
                challenge_id: results1.insertId,
                total_auth_cnt: cnt_of_week,
              },
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

  // 챌린지 인증 요청
  // Data Type : Front 쪽에서 data JSON Type으로 서버로 전달
  // var data = {user_info_id : 2, Alien_id : 2, Challenge_id : 2, requestUserNickname : 'john', imgURL : 'test_url' comment: 'comment'};
  router.post("/auth", function (req, res) {
    let data = req.body;
    data.request_user = req.user.nickname;
    const alien_id = req.body.alien_id;
    const sql1 = `INSERT INTO practice_record SET ?;`;
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql1, data, function (error, results, fields) {
        if (error) {
          console.error(error);
          res.json({
            result: "fail",
            msg: "Fail to upload Information to Database.",
          });
          connection.release();
          return;
        }

        const sql2 = `UPDATE alien SET practice_status=1 where id=${alien_id}`;
        connection.query(sql2, async (err, results, fields) => {
          if (err) {
            console.error(err);
            res.json({
              result: "fail",
              msg: "Fail to update alien practice_status on Database.",
            });
            connection.release();
            return;
          }

          res.json({
            result: "success",
            msg: "인증요청이 완료되었습니다.",
          });

          // TODO:
          // 1단계: 타노스의 시간인지 확인: 23:25 ~ 24:05
          let today = new Date(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
          );
          let hours = today.getHours();
          let minutes = today.getMinutes();
          if (hours == 23 && minutes >= 25) {
            // 2단계: 타노스의 시간인 경우, 레디스 처리
            if (!!rdsClient.connected) {
              try {
                const challenge_id = req.body.challenge_id;
                const alien_id = req.body.alien_id;
                let value = await rdsClient.HDEL(`chal-${challenge_id}`, `${alien_id}`);
                console.log("death note", value);
                }
              catch (err) {
                console.error("NOT EXIST chal-alien", err);
              }
            }
          }
          connection.release();
          return;
        });
      });
    });
  });

  router.post("/search", function (req, res) {
    var data = req.body;
    // console.log(data.keyword);
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(
        `select * from challenge where challenge_name regexp '${data.keyword}'`,
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

  router.post("/searchCategory", function (req, res) {
    var category = req.body.category;
    let sql1;
    if (category === "전체") {
      sql1 = "select * from challenge";
    } else {
      sql1 = `select * from challenge where tag = "${category}"`;
    }
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql1, function (err, results, fields) {
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
      });
    });
  });

  // 챌린지 인증 수락
  // auth data 에 수락표시 is auth 수정
  // alien에 accured auth count / week_auth_cnt 1씩 증가
  router.post("/approval", function (req, res) {
    const data = req.body;
    const auth_id = data.auth_id;
    const Alien_id = data.Alien_id;
    const request_date = data.request_date.split("T")[0].split("-");
    console.log(request_date);
    //1. 날짜 지난지 check 지났으면 Client에 메시지 return
    const request_month = request_date[1];
    const request_day = request_date[2];
    let today = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    );
    if (
      today.getMonth() + 1 != request_month ||
      today.getDate() > request_day
    ) {
      res.json({
        result: "fail",
        msg: "인증 수락 가능한 날짜가 만료되었습니다.",
      });
      return;
    }
    //2. practice_record id로 검색 후 수정 / 0 row changed -> Client notice.
    sql2 = `update alien set accumulated_count = accumulated_count+1, practice_status=2 where id = ${Alien_id}`;
    sql1 = `update practice_record set record_status = record_status +1, response_date = NOW(), response_user_id = ${req.user.id}, response_user="${req.user.nickname}" where id=${auth_id} and record_status=0;`; // is Auth = 0 일때만 올리고 0 row 변하면 이미 완료된 요청입니다.
    pool.getConnection(function (err, connection) {
      if (err) throw err;
      connection.query(sql1, function (error, results, fields) {
        if (error) {
          console.error(error);
          res.json({
            result: "fail",
            msg: "[DB] Fail to update Database.",
          });
          return;
        }

        if (results.message.split("  ")[0] == "(Rows matched: 0") {
          res.json({
            result: "fail",
            msg: "이미 인증이 완료된 건 입니다.",
          });
          return;
        }
        connection.query(sql2, function (error, results, fields) {
          if (error) {
            res.json({
              result: "fail",
              msg: "[DB] Fail to update Database.",
            });
            return;
          }
          res.json({ result: "success" });
          connection.release();
        });
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
