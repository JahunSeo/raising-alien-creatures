import RoomClient from "./room/RoomClient";

class Aquarium {
  constructor() {
    this.current = null;
    this.rooms = {};
  }

  setCurrentRoom(roomId) {
    if (!(roomId in this.rooms)) {
      this.addRoom(roomId);
    }
    this.current = roomId;
    return this.rooms[this.current];
  }

  getCurrentRoom() {
    return this.rooms[this.current];
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

export default new Aquarium();
