export default class Room {
  constructor(roomId) {
    this.roomId = roomId;
    this.fieldState = null;
  }

  initFieldState(roomId) {
    console.log("initFieldState", roomId);
    // init field
    // TODO: 서버에서 해당 어항에 포함된 몬스터들을 가져오기
    const state = {
      monsters: [],
    };
    this.fieldState = state;
    this.clientCnt = 0;
  }

  addClient(clientId) {
    const monster = this.initMonster(clientId);
    this.fieldState.monsters.push(monster);
    // TODO from other place
    // mapClientToRoom[socketId] = roomId;
    this.clientCnt += 1;
    return this.clientCnt;
  }

  removeClient(clientId) {
    this.fieldState.monsters = this.fieldState.monsters.filter(
      (mon) => mon.clientId !== clientId
    );
    this.clientCnt -= 1;
    return this.clientCnt;
    // TODO from other place
    // delete mapClientToRoom[socketId];
  }

  initMonster(clientId) {
    // generate random monster
    let randRange = 300;
    let x = (Math.random() - 0.5) * randRange;
    let y = (Math.random() - 0.5) * randRange;
    const monster = {
      clientId, // TODO: user id or email
      position: { x, y },
      destination: { x, y },
      size: 50 + Math.random() * 100,
      color: this.getRandomColor(),
    };
    return monster;
  }

  updateMonster(clientId, features) {
    this.fieldState.monsters = this.fieldState.monsters.map((mon) => {
      if (mon.clientId !== clientId) return mon;
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
