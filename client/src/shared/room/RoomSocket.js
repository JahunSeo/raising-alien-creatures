// import Wanderer from "../creature/Wanderer.js";
// import { FRAME_PER_SEC, FRAME_PER_EMIT } from "../lib/Constants.js";

class RoomSocket {
  constructor(roomId) {
    this.roomId = roomId;
    this.clientCnt = 0; // TODO: 접속해 있는 사람 수 개념으로 분리
    this.clients = {};
    this.users = {};
    //
    this.broadcastQueue = [];
  }

  start(io) {
    this.io = io;
  }

  close() {}

  addParticipant(client) {
    // 참가자 추가
    this.clients[client.clientId] = client;
    this.clientCnt += 1;
    if (!(client.userId in this.users)) {
      this.users[client.userId] = 0;
    }
    this.users[client.userId]++;
    // console.log("addParticipant", this.clients, this.users);
    const usersOnRoom = Object.keys(this.users).map((id) => Number(id));
    this.io.to(this.roomId).emit("usersOnRoom", usersOnRoom);

    return true;
  }

  removeParticipant(client) {
    // 참가자 제거
    delete this.clients[client.clientId];
    this.clientCnt -= 1;
    this.users[client.userId]--;
    if (this.users[client.userId] === 0) {
      delete this.users[client.userId];
    }
    // console.log("removeParticipant", this.clients, this.users);
    const usersOnRoom = Object.keys(this.users).map((id) => Number(id));
    this.io.to(this.roomId).emit("usersOnRoom", usersOnRoom);

    return this.clientCnt;
  }
}

export default RoomSocket;
