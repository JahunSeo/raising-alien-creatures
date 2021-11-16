import Camera from "./Camera";

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

  syncFieldState = (fieldState) => {
    const monsterLength = Object.keys(fieldState.monsters).length;
    console.log("[socket] syncFieldState:", fieldState);
    if (monsterLength <= 0) {
      console.error("ERROR!! zero monster issue should be fixed!!");
      return;
    }

    // for (let monId in fieldState.monsters) {
    //   let mon = this.fieldState.monsters[monId];
    //   mon.run();
    // }

    this.fieldState = fieldState;
  };
}

export default RoomClient;
