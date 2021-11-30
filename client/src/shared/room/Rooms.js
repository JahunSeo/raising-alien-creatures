import RoomClient from "./RoomClient";

class Rooms {
  constructor() {
    this.rooms = {};
  }

  addRoom(roomId) {
    this.rooms[roomId] = new RoomClient(roomId);
  }

  getRoom(roomId) {
    return this.rooms[roomId];
  }

  removeRoom(roomId) {
    delete this.rooms[roomId];
  }
}

export default new Rooms();
