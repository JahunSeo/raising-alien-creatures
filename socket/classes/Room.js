class Room {
  constructor(roomId) {
    this.roomId = roomId;
    this.clientCnt = 0; // TODO: 접속해 있는 사람 수 개념으로 분리
    this.participant = {};
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
    const monster = this.initMonster(user.userId);
    this.fieldState.monsters.push(monster);
    // 참가자 추가
    this.participant[user.userId] = user;
    this.clientCnt += 1;
    return true;
  }

  removeParticipant(user) {
    // 몬스터 제거
    this.fieldState.monsters = this.fieldState.monsters.filter(
      (mon) => mon.userId !== user.userId
    );
    // 참가자 제거
    delete this.participant[user.userId];
    this.clientCnt -= 1;
    return this.clientCnt;
  }

  initMonster(userId) {
    // generate random monster
    let randRange = 300;
    let x = (Math.random() - 0.5) * randRange;
    let y = (Math.random() - 0.5) * randRange;
    const monster = {
      userId, // TODO: user id or email
      position: { x, y },
      destination: { x, y },
      size: 50 + Math.random() * 100,
      color: this.getRandomColor(),
    };
    return monster;
  }

  updateMonster(userId, features) {
    this.fieldState.monsters = this.fieldState.monsters.map((mon) => {
      if (mon.userId !== userId) return mon;
      return {
        ...mon,
        ...features,
      };
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
