const schedule = require("node-schedule");

// 생명체 사망 api
exports.j = schedule.scheduleJob({ hour: 15, minute: 00 }, function () {
  //UTC를 위한 dirty code
    let today = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
    let day = today.getDay();
    // 일요일에 스케줄러가 돌면 토요일날 인증완료 여부를 파악하기 위해 한 칸씩 뒤로 된 것임.
    // 인증요청조차 하지 않은 생명체 죽음상태(status = 2)로 변경
    // 트리거를 통해 participant - 1
    // 트리거를 통해 user_info_has_challenge row 삭제
    // 인증요청, 완료한 생명체는 practice_status = 0로 변경
    let sql1;
    let sql2;
    if (day === 0) {
      sql1 = 'UPDATE Alien SET status = 2, end_date = NOW() WHERE (sat = 1 AND status = 0 AND practice_status = 0);';
      sql2 = 'UPDATE Alien SET practice_status = 0 WHERE (sat = 1 AND status = 0 AND practice_status != 0);';
    } else if (day === 1) {
      sql1 = 'UPDATE Alien SET status = 2, end_date = NOW() WHERE (sun = 1 AND status = 0 AND practice_status = 0);';
      sql2 = 'UPDATE Alien SET practice_status = 0 WHERE (sun = 1 AND status = 0 AND practice_status != 0);';

    } else if (day === 2) {
      sql1 = 'UPDATE Alien SET status = 2, end_date = NOW() WHERE (mon = 1 AND status = 0 AND practice_status = 0);';
      sql2 = 'UPDATE Alien SET practice_status = 0 WHERE (mon = 1 AND status = 0 AND practice_status != 0);';
    } else if (day === 3) {
      sql1 = 'UPDATE Alien SET status = 2, end_date = NOW() WHERE (tue = 1 AND status = 0 AND practice_status = 0);';
      sql2 = 'UPDATE Alien SET practice_status = 0 WHERE (tue = 1 AND status = 0 AND practice_status != 0);';
    } else if (day === 4) {
      sql1 = 'UPDATE Alien SET status = 2, end_date = NOW() WHERE (wed = 1 AND status = 0 AND practice_status = 0);';
      sql2 = 'UPDATE Alien SET practice_status = 0 WHERE (wed = 1 AND status = 0 AND practice_status != 0);';
    } else if (day === 5) {
      sql1 = 'UPDATE Alien SET status = 2, end_date = NOW() WHERE (thu = 1 AND status = 0 AND practice_status = 0);';
      sql2 = 'UPDATE Alien SET practice_status = 0 WHERE (thu = 1 AND status = 0 AND practice_status != 0);';
    } else {
      sql1 = 'UPDATE Alien SET status = 2, end_date = NOW() WHERE (fri = 1 AND status = 0 AND practice_status = 0);';
      sql2 = 'UPDATE Alien SET practice_status = 0 WHERE (fri = 1 AND status = 0 AND practice_status != 0);';
    }
  
    poll.getConnection(function(err, connection){
      if (err) {
        console.error(err);
        return;
      }
      
      connection.query(
        sql1 + sql2, 
        [trans_num_to_str[day], trans_num_to_str[day]],
        function (error, results) {
          if (error) {
            console.error('at the scheduler api', error);
            return;
          }
          connection.release();
        }
      )
    })
  });

