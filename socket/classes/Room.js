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
      monsters: [],
    };
    this.fieldState = state;
  }

  getFieldState() {
    return this.fieldState;
  }

  addParticipant(user) {
    // 몬스터 추가
    const monster = new Monster(user.userId);
    this.fieldState.monsters.push(monster);
    // 참가자 추가
    this.participants[user.userId] = user;
    this.clientCnt += 1;
    return true;
  }

  removeParticipant(user) {
    // 몬스터 제거
    this.fieldState.monsters = this.fieldState.monsters.filter(
      (mon) => mon.userId !== user.userId
    );
    // 참가자 제거
    delete this.participants[user.userId];
    this.clientCnt -= 1;
    return this.clientCnt;
  }

  updateMonster(userId, features) {
    this.fieldState.monsters.forEach((mon) => {
      if (mon.userId == userId) {
        mon.update(features);
      }
    });
  }

  getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

module.exports = Room;
