const Monster = require("./Monster");

class Room {
  constructor(roomId) {
    this.roomId = roomId;
    this.clientCnt = 0; // TODO: 접속해 있는 사람 수 개념으로 분리
    this.participants = {};
    this.initFieldState();
  }

  initFieldState() {
    // init field
    // TODO: 서버에서 해당 어항에 포함된 몬스터들을 가져오기
    const state = {
      monsters: {}, // TODO: 효율을 위해 dict를 선택함. 이 때 monster들의 순서를 어떻게 통제할까? 순서 배열을 별도로 관리?
    };
    this.fieldState = state;
  }

  getFieldState() {
    return this.fieldState;
  }

  addParticipant(user) {
    // 몬스터 추가
    const monster = new Monster(user.userId);
    this.fieldState.monsters[user.userId] = monster;
    // 참가자 추가
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
    return this.clientCnt;
  }

  updateMonster(userId, features) {
    this.fieldState.monsters[userId].update(features);
  }
}

module.exports = Room;
