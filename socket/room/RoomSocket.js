class RoomSocket {
  constructor(props) {
    this.id = props.id;
    this.users = {};
    // console.log("   [Room] constructor", this.id);
  }

  start(io) {
    this.io = io;
  }

  close() {}

  addUser(user) {
    // 이미 접속한 user가 있는 경우 처리
    if (user.id in this.users) return;
    this.users[user.id] = user;
  }

  removeUser(userId) {
    delete this.users[userId];
  }

  getUserCnt() {
    return Object.keys(this.users).length;
  }

  // addParticipant(client) {
  //   // 참가자 추가
  //   this.clients[client.clientId] = client;
  //   this.clientCnt += 1;
  //   if (!(client.userId in this.users)) {
  //     this.users[client.userId] = 0;
  //   }
  //   this.users[client.userId]++;
  //   // console.log("addParticipant", this.clients, this.users);
  //   const usersOnRoom = Object.keys(this.users).map((id) => Number(id));
  //   this.io.to(this.roomId).emit("usersOnRoom", usersOnRoom);

  //   return true;
  // }

  // removeParticipant(client) {
  //   // 참가자 제거
  //   delete this.clients[client.clientId];
  //   this.clientCnt -= 1;
  //   this.users[client.userId]--;
  //   if (this.users[client.userId] === 0) {
  //     delete this.users[client.userId];
  //   }
  //   // console.log("removeParticipant", this.clients, this.users);
  //   const usersOnRoom = Object.keys(this.users).map((id) => Number(id));
  //   this.io.to(this.roomId).emit("usersOnRoom", usersOnRoom);

  //   return this.clientCnt;
  // }
}

export default RoomSocket;
