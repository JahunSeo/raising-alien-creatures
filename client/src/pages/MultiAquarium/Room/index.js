import Camera from "./Camera";

class Room {
  constructor(roomId) {
    // console.log("Room init", roomId);
    this.roomId = roomId;
    this.camera = new Camera();
    this.fieldState = undefined;
  }

  updateFieldState = (fieldState) => {
    const monsterLength = Object.keys(fieldState.monsters).length;
    // console.log("[socket] fieldState:", fieldState);
    if (monsterLength <= 0) {
      console.error("ERROR!! zero monster issue should be fixed!!");
      return;
    }
    this.fieldState = fieldState;
  };
}

export default Room;
