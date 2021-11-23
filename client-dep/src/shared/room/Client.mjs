class Client {
  constructor(props) {
    this.clientId = props.clientId;
    this.userId = props.userId;
    // TODO: handle multiple rooms
    this.roomId = null;
  }

  enterRoom(roomId) {
    // TODO: handle multiple rooms
    this.roomId = roomId;
  }

  getParticipatingRooms() {
    // TODO: handle multiple rooms
    return this.roomId;
  }

  getOutOfRoom(dummy_roomId) {
    // TODO: handle multiple rooms
    // this.roomId = null;
    return this.roomId;
  }
}

export default Client;
