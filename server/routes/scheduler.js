const schedule = require("node-schedule");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../../.env") });
const mysql = require("mysql");

exports.notiSchedule = function (rdsClient) {
  schedule.scheduleJob(
    { hour: 14, minute: 30 },
    // "0,10,20,30,40,50 * * * * *",
    function () {
      const pool = mysql.createPool({
        connectionLimit: 1,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true,
      });

      let today = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
      );
      let day = today.getDay();
      console.log("DAY", day);

      let columns = `challenge_id, user_info_id, alien.id, challenge_name, alien_name`;
      const makeSQL = (columns, day) => {
        return `SELECT ${columns} FROM alien LEFT JOIN challenge \
                ON alien.challenge_id=challenge.id\
                where ${day} = 1 and alien_status = 0 and practice_status = 0`;
      };
      let sql1;
      if (day === 0) sql1 = makeSQL(columns, "sun");
      else if (day === 1) sql1 = makeSQL(columns, "mon");
      else if (day === 2) sql1 = makeSQL(columns, "tue");
      else if (day === 3) sql1 = makeSQL(columns, "wed");
      else if (day === 4) sql1 = makeSQL(columns, "thu");
      else if (day === 5) sql1 = makeSQL(columns, "fri");
      else sql1 = makeSQL(columns, "sat");

      let challenge_alien = new Object();
      pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(sql1, async (error, results) => {
          if (error) {
            console.error("at the scheduler api", error);
            connection.release();
            return;
          }
          // 1단계: 사망 생명체 명단 생성
          results.forEach((element) => {
            let _key = "chal-" + element.challenge_id;
            if (!challenge_alien.hasOwnProperty(_key)) {
              challenge_alien[_key] = {};
            }
            let obj = {};
            obj.userId = element.user_info_id;
            obj.msg = `'${element.challenge_name}'챌린지에서 '${element.alien_name}' 생명체가 사망했습니다.`;
            challenge_alien[_key][element.id] = JSON.stringify(obj);
          });
          console.log(challenge_alien);
          console.log("rdsClient", rdsClient.connected);
          // 2단계: 사망 생명체들을 레디스(데스노트)에 기록
          const promises = [];
          for (const roomId in challenge_alien) {
            const aliens = challenge_alien[roomId];
            for (const alienId in aliens) {
              promises.push(rdsClient.HSET(roomId, alienId, aliens[alienId]));
            }
          }
          await Promise.all(promises);

          // let value = await rdsClient.HGETALL("chal-7");
          // console.log("death note", value);
          // value = await rdsClient.HGETALL("chal-262");
          // console.log("death note", value);
          // value = await rdsClient.HDEL("chal-7", "358");
          // console.log("death note", value);
          // value = await rdsClient.DEL("chal-262");
          // console.log("death note", value);

          // value = await rdsClient.HGETALL("chal-7");
          // console.log("death note", value);
          // //
          // value = await rdsClient.KEYS("chal-*");
          // console.log("keys", value);

          connection.release();
        });
      });
    }
  );
};

// TODO: rebuilding!!
exports.dead_schedule = schedule.scheduleJob(
  { hour: 15, minute: 00 },
  function () {
    const pool = mysql.createPool({
      connectionLimit: 1,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true,
    });
    // UTC를 위한 dirty code
    let today = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    );
    let day = today.getDay();
    // 일요일에 스케줄러가 돌면 토요일날 인증완료 여부를 파악하기 위해 한 칸씩 뒤로 된 것임.
    // 인증요청조차 하지 않은 생명체 죽음상태(status = 2)로 변경
    // 트리거를 통해 participant - 1
    // 트리거를 통해 user_info_has_challenge row 삭제
    // 인증요청, 완료한 생명체는 practice_status = 0로 변경
    let sql1;
    let sql2;
    if (day === 0) {
      sql1 =
        "UPDATE alien SET alien_status = 2, end_date = NOW() WHERE (sat = 1 AND alien_status = 0 AND practice_status = 0);";
      sql2 =
        "UPDATE alien SET practice_status = 0 WHERE (sat = 1 AND alien_status = 0 AND practice_status != 0);";
    } else if (day === 1) {
      sql1 =
        "UPDATE alien SET alien_status = 2, end_date = NOW() WHERE (sun = 1 AND alien_status = 0 AND practice_status = 0);";
      sql2 =
        "UPDATE alien SET practice_status = 0 WHERE (sun = 1 AND alien_status = 0 AND practice_status != 0);";
    } else if (day === 2) {
      sql1 =
        "UPDATE alien SET alien_status = 2, end_date = NOW() WHERE (mon = 1 AND alien_status = 0 AND practice_status = 0);";
      sql2 =
        "UPDATE alien SET practice_status = 0 WHERE (mon = 1 AND alien_status = 0 AND practice_status != 0);";
    } else if (day === 3) {
      sql1 =
        "UPDATE alien SET alien_status = 2, end_date = NOW() WHERE (tue = 1 AND alien_status = 0 AND practice_status = 0);";
      sql2 =
        "UPDATE alien SET practice_status = 0 WHERE (tue = 1 AND alien_status = 0 AND practice_status != 0);";
    } else if (day === 4) {
      sql1 =
        "UPDATE alien SET alien_status = 2, end_date = NOW() WHERE (wed = 1 AND alien_status = 0 AND practice_status = 0);";
      sql2 =
        "UPDATE alien SET practice_status = 0 WHERE (wed = 1 AND alien_status = 0 AND practice_status != 0);";
    } else if (day === 5) {
      sql1 =
        "UPDATE alien SET alien_status = 2, end_date = NOW() WHERE (thu = 1 AND alien_status = 0 AND practice_status = 0);";
      sql2 =
        "UPDATE alien SET practice_status = 0 WHERE (thu = 1 AND alien_status = 0 AND practice_status != 0);";
    } else {
      sql1 =
        "UPDATE alien SET alien_status = 2, end_date = NOW() WHERE (fri = 1 AND alien_status = 0 AND practice_status = 0);";
      sql2 =
        "UPDATE alien SET practice_status = 0 WHERE (fri = 1 AND alien_status = 0 AND practice_status != 0);";
    }

    pool.getConnection(function (err, connection) {
      if (err) throw err;

      connection.query(sql1 + sql2, function (error, results) {
        if (error) {
          console.error("at the scheduler api", error);
          return;
        }
        console.log(results);
        connection.release();
      });
    });
  }
);
