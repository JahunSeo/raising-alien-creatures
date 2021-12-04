const schedule = require("node-schedule");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../../.env") });
const mysql = require("mysql");
const { ConfigurationServicePlaceholders } = require("aws-sdk/lib/config_service_placeholders");

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

      pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(sql1, async (error, results) => {
          if (error || !rdsClient.connected) {
            console.error("THANOS READY FAIL", error);
            connection.release();
            return;
          }

          // 사망 생명체 명단을 데스노트에 추가
          const promises = [];
          results.forEach((alien) => {
            const roomId = `chal-${alien.challenge_id}`;
            const alienId = `${alien.id}`;
            let toast = {};
            toast.userId = alien.user_info_id;
            toast.msg = `'${alien.challenge_name}'챌린지에서 '${alien.alien_name}' 생명체가 사망했습니다.`;
            toast = JSON.stringify(toast);
            // console.log(roomId, alienId, toast);
            promises.push(rdsClient.HSET(roomId, alienId, toast));
          });
          await Promise.all(promises);
          console.log("THANOS READY SUCCESS", results.length);

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
exports.deadSchedule = function (rdsClient) {
  schedule.scheduleJob(
  // { hour: 15, minute: 10 },
  "0,10,20,30,40,50 * * * * *",
  async function () {
    const pool = mysql.createPool({
      connectionLimit: 1,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true,
    });

    // 인증요청, 완료한 생명체는 practice_status = 0로 변경
    let today = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    );
    let day = today.getDay();
    const makeSQL = (day) => {
      return `UPDATE alien SET practice_status = 0 WHERE (${day} = 1 AND alien_status = 0 AND practice_status != 0);`;
    };
    
    let sql1;
    if (day === 0) sql1 = makeSQL("sat");
    else if (day === 1) sql1 = makeSQL("sun");
    else if (day === 2) sql1 = makeSQL("mon");
    else if (day === 3) sql1 = makeSQL("tue");
    else if (day === 4) sql1 = makeSQL("wed");
    else if (day === 5) sql1 = makeSQL("thu");
    else sql1 = makeSQL("fri");

    pool.getConnection(function (err, connection) {
      if (err) {
        console.error("at the scheduler api to getConnection", error);
        return;
      }

      connection.query(sql1, function (error, results) {
        if (error) {
          console.error("at the scheduler api to query", error);
          return;
        }
        connection.release();
      });
    });


  // redis에서 죽여야하는 생명체 과져와서 죽이는 것 처리
  keys = await rdsClient.KEYS("chal-*");
  if (keys) {
    keys.forEach( async (key) => {
      let challengeId;
      try {
      challengeId = key.split('-')[1];
      } catch (err) {
        console.log(err);
        return;
      }
      infos = await rdsClient.HGETALL(key);

      for (alienId in infos) {
        let deadAlienId;
        let userId;
        try{
        deadAlienId = alienId;
        const parsingString = infos[alienId].split(":")[1];
        userId = parsingString.split(",")[0];
        } catch (err) {
          console.log(err);
          return;
        }

        const sql2 = `DELETE FROM user_info_has_challenge WHERE user_info_id=${userId} AND challenge_id=${challengeId};`
        const sql3 = `UPDATE alien SET alien_status = 2 WHERE id=${deadAlienId}`
        const sql4 = `UPDATE challenge SET participant_number = participant_number - 1 WHERE id=${challengeId}`
        pool.getConnection(function (err, connection) {
        if (err) {
          console.error("at the scheduler api to getConnection", error);
          return;
        }

        connection.query(sql2+sql3+sql4, function (error, results) {
          if (error) {
            console.error("at the scheduler api to query", error);
            return;
          }
          console.log(results);
          connection.release();
        });
      });
      }
      await rdsClient.DEL(key);
    })
  }
  }
);
}