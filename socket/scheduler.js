import schedule from "node-schedule";

export const alienWarnSchedule = (io, rdsClient) => {
  schedule.scheduleJob(
    { hour: 14, minute: 30 },
    // "0,15,30,45 * * * * *",
    async () => {
      // 1단계: redis에서 데스노트 가져오기
      let roomIds = await rdsClient.KEYS("chal-*");
      let promises = roomIds.map((roomId) => rdsClient.HGETALL(roomId));
      let results = await Promise.all(promises);
      // 2단계: 정보 가공해 전송하기
      results.forEach((challenge) => {
        // 정보 가공
        let toasts = [];
        for (const alienId in challenge) {
          try {
            let toast = JSON.parse(challenge[alienId]);
            toasts.push(toast);
          } catch (err) {
            console.error(err);
          }
        }
        // 전송
        if (toasts.length > 0) {
          const challengeId = toasts[0].challengeId;
          io.in(challengeId).emit("thanos_warn", toasts);
        }
      });
    }
  );
};

export const alienDeathSchedule = (io, rdsClient) => {
  schedule.scheduleJob(
    { hour: 15, minute: 0 },
    // "0,15,30,45 * * * * *",
    async () => {
      // 1단계: redis에서 데스노트 가져오기
      let roomIds = await rdsClient.KEYS("chal-*");
      let promises = roomIds.map((roomId) => rdsClient.HGETALL(roomId));
      let results = await Promise.all(promises);
      // 2단계: 정보 가공해 전송하기
      results.forEach((challenge) => {
        // 정보 가공
        let toasts = [];
        for (const alienId in challenge) {
          try {
            let toast = JSON.parse(challenge[alienId]);
            toasts.push(toast);
          } catch (err) {
            console.error(err);
          }
        }
        // 전송
        if (toasts.length > 0) {
          const challengeId = toasts[0].challengeId;
          io.in(challengeId).emit("thanos_done", toasts);
          //   console.log(challengeId, toasts.length);
        }
      });
      // 스케쥴러에 추가할 때 참고!
      //   io.emit("thanos_done", { hello: "0000" });
      //   io.in(1).emit("thanos_done", { hello: "1111" });
    }
  );
};
