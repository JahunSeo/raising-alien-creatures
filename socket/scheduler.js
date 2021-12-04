import schedule from "node-schedule";

export const alienDeathSchedule = (rdsClient) => {
  schedule.scheduleJob(
    { hour: 14, minute: 30 },
    // "0,10,20,30,40,50 * * * * *",
    async () => {
      let roomIds = await rdsClient.KEYS("chal-*");
      console.log("roomIds", roomIds);

      //
      //
      //     // 사망 생명체 명단을 데스노트에 추가
      //   const promises = [];
      //   results.forEach((alien) => {
      //     const roomId = `chal-${alien.challenge_id}`;
      //     const alienId = `${alien.id}`;
      //     let toast = {};
      //     toast.userId = alien.user_info_id;
      //     toast.msg = `'${alien.challenge_name}'챌린지에서 '${alien.alien_name}' 생명체가 사망했습니다.`;
      //     toast = JSON.stringify(toast);
      //     // console.log(roomId, alienId, toast);
      //     promises.push(rdsClient.HSET(roomId, alienId, toast));
      //   });
      //   await Promise.all(promises);
      //   console.log("THANOS READY SUCCESS", results.length);
      //
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
    }
  );
};
