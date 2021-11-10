class Room {
  constructor(roomId) {
    console.log("Room init", roomId);
    this.roomId = roomId;
    this.level = 7;
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
