const { PollyCustomizations } = require("aws-sdk/lib/services/polly");
const schedule = require("node-schedule");

// 생명체 사망 api
exports.j = schedule.scheduleJob({ hour: 21, minute: 31 }, function () {
    let today = new Date();
    let day = today.getDay();
    // 숫자로 들어오는 오늘 요일을 컬럼명과 같도록 변경하기위한 obj.
    // 일요일에 스케줄러가 돌면 토요일날 인증완료 여부를 파악하기 위해 한 칸씩 뒤로 된 것임.
    trans_num_to_str = {
      0: 'sat',
      1: 'sun',
      2: 'mon',
      3: 'tue',
      4: 'wed',
      5: 'thu',
      6: 'fri',
    }
    // 인증요청조차 하지 않은 생명체 죽음상태(status = 2)로 변경
    // 트리거를 통해 participant - 1
    // 트리거를 통해 user_info_has_challenge row 삭제
    const sql1 = 'UPDATE Alien SET status = 2, end_date = NOW() WHERE (? = 1 AND status = 0 AND practice_status = 0);'
    // 인증요청, 완료한 생명체는 practice_status = 0로 변경
    const sql2 = 'UPDATE Alien SET practice_status = 0 WHERE (? = 1 AND status = 0 AND practice_status != 0);'
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

