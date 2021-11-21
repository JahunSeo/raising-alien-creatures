import Wanderer from "../creature/Wanderer.js";
import { FRAME_PER_SEC, FRAME_PER_EMIT } from "../lib/Constants.js";

class RoomSocket {
  constructor(roomId) {
    this.roomId = roomId;
    this.clientCnt = 0; // TODO: 접속해 있는 사람 수 개념으로 분리
    this.participants = {};
    this.interval = null;
    this.intervalCnt = 0;
    //
    this.extraCnt = 20;
    this.initFieldState();
    //
    this.broadcastQueue = [];
  }

  initFieldState() {
    // init field
    // TODO: 서버에서 해당 어항에 포함된 몬스터들을 가져오기
    const state = {
      monsters: {}, // TODO: 효율을 위해 dict를 선택함. 이 때 monster들의 순서를 어떻게 통제할까? 순서 배열을 별도로 관리?
    };

    for (let i = 0; i < this.extraCnt; i++) {
      const extraId = `extra-${i}`;
      const monster = new Wanderer({ userId: extraId, monId: extraId });
      state.monsters[extraId] = monster;
    }

    this.fieldState = state;
  }

  start(io) {
    this.io = io;
    this.interval = setInterval(
      () => this.updateGameState(),
      1000 / FRAME_PER_SEC
    );
  }

  updateGameState() {
    for (let monId in this.fieldState.monsters) {
      let mon = this.fieldState.monsters[monId];
      mon.run();
    }

    if (this.intervalCnt % FRAME_PER_EMIT === 0) {
      // temporary stop
      // this.io.to(this.roomId).emit("fieldState", this.getFieldState());
      this.intervalCnt = 0;
    }
    this.intervalCnt++;
  }

  getFieldState() {
    // TODO: instance들을 일반 object로 변경해주어야 할까?
    // - 아니면 알아서 변환이 되려나?

    return this.fieldState;

    // const state = {
    //   monsters: {},
    // };
    // for (let userId in this.fieldState.monsters) {
    //   let mon = this.fieldState.monsters[userId];
    //   state.monsters[userId] = {
    //     userId: mon.userId,
    //     location: mon.location,
    //     angle: mon.angle,
    //     size: mon.size,
    //     color: mon.color,
    //   };
    // }

    // return state;
  }

  close() {
    clearInterval(this.interval);
  }

  addParticipant(user) {
    // // 몬스터 추가
    // const userId = user.userId;
    // const monId = user.userId; //temp
    // const monster = new Wanderer({ userId, monId });
    // this.fieldState.monsters[monId] = monster;

    // 참가자 추가
    this.io.to(this.roomId).emit("fieldState", this.getFieldState());
    this.participants[user.userId] = user;
    this.clientCnt += 1;
    return true;
  }

  removeParticipant(user) {
    // 몬스터 제거
    delete this.fieldState.monsters[user.userId];
    // 참가자 제거
    delete this.participants[user.userId];
    this.clientCnt -= 1;
    this.io.to(this.roomId).emit("fieldState", this.getFieldState());

    return this.clientCnt;
  }

  updateMonster(userId, features) {
    // TODO: validation check

    if (this.fieldState.monsters[userId])
      this.fieldState.monsters[userId].directUpdate(features);
  }
}

export default RoomSocket;
