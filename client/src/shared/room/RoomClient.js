import Camera from "./Camera";
import Wanderer from "../creature/Wanderer";

class RoomClient {
  constructor(roomId) {
    // console.log("Room init", roomId);
    this.roomId = roomId;
    this.camera = new Camera();
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

  syncFieldState = (socketState) => {
    const monsterLength = Object.keys(socketState.monsters).length;
    console.log("[socket] syncFieldState:", socketState);
    if (monsterLength <= 0) {
      console.error("ERROR!! zero monster issue should be fixed!!");
      return;
    }
    // monster를 하나씩 업데이트
    for (let monId in socketState.monsters) {
      // socket에서 받아온 monster plain object
      const monPlain = socketState.monsters[monId];
      // 해당 monster가 없는 경우 object 생성해 추가
      if (!(monId in this.fieldState.monsters)) {
        const monster = new Wanderer({
          userId: monPlain.userId,
          monId: monPlain.monId,
        });
        this.fieldState.monsters[monId] = monster;
      }
      // monster 상태값 업데이트
      this.fieldState.monsters[monId].sync(monPlain);
    }

    // this.fieldState = socketState;
  };
}

export default RoomClient;
