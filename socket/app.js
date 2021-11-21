// https://socket.io/docs/v4/server-initialization/
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import Room from "../client/src/shared/room/RoomSocket.mjs";
import Client from "../client/src/shared/room/Client.mjs";

const app = express();
const httpServer = createServer(app);
// https://socket.io/docs/v3/handling-cors/
const options = {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
}; //if needed
const io = new Server(httpServer, options);

const rooms = {};
const clients = {};

io.on("connection", (socket) => {
  console.log(`[socket server] connection with ${socket.id}`);
  const clientId = socket.id;

  const handleJoin = (info) => {
    const { roomId, userId } = info;
    console.log(
      `[socket server] join ${clientId}, roomId ${roomId}, userId ${userId}`
    );
    // 새로운 client 생성
    if (clients[clientId]) return false; // ERROR
    const client = new Client({ clientId, userId, roomId });
    clients[clientId] = client;

    // 해당 room에 client 추가
    if (!rooms[roomId]) {
      rooms[roomId] = new Room(roomId);
      rooms[roomId].start(io);
    }
    // client에 room 추가 및 join
    client.enterRoom(roomId);
    socket.join(roomId);

    let result = rooms[roomId].addParticipant(client);
    if (!result) return false; // ERROR

    // broadcasting to all
    // io.to(roomId).emit("fieldState", rooms[roomId].getFieldState());
    console.log(
      `[socket server] join result clientCnt: ${
        rooms[roomId] && rooms[roomId].clientCnt
      } / roomCnt: ${Object.keys(rooms).length}`
    );
  };

  const handleChangeDestination = (data) => {
    console.log(`[socket server] changeDestination`, clientId, data);
    const { roomId, monster } = data;
    if (!rooms[roomId]) {
      console.log(`[socket server] changeDestination ERROR!!`);
      console.log(` ==> there is no room of id ${roomId}`);
      // TODO: client에 에러 전달?
      return false;
    }

    // update monster destination
    rooms[roomId].updateMonster(clientId, monster);

    // broadcasting to all
    // io.to(roomId).emit("fieldState", rooms[roomId].getFieldState());
  };

  const handleDisconnect = () => {
    // 방에서 참가자 제거
    console.log(`[socket server] disconnect client ${clientId}`);
    const client = clients[clientId];
    if (!client) return false; // ERROR

    const roomId = client.getParticipatingRooms();
    let remaining_num = rooms[roomId].removeParticipant(client);

    // 유저 제거
    delete clients[clientId];

    // 방에 참가자가 아무도 없는 경우, 방 제거
    if (rooms[roomId] && remaining_num <= 0) {
      // close room
      rooms[roomId].close();
      delete rooms[roomId];
    }
    // 방에 참가자가 남아 있는 경우, 남은 참가자들에게 전송
    else {
      // io.to(roomId).emit("fieldState", rooms[roomId].getFieldState());
    }
    console.log(
      `[socket server] disconnect result clientCnt: ${
        rooms[roomId] ? rooms[roomId].clientCnt : "none"
      } / roomCnt: ${Object.keys(rooms).length}`
    );
  };

  socket.on("join", handleJoin);
  socket.on("changeDestination", handleChangeDestination);
  socket.on("disconnect", handleDisconnect);
});

const port = process.env.SOCKET_PORT || 5001;

httpServer.listen(port, () => {
  console.log(`** Raising Alien Creatures Socket Server **`);
  console.log(`App listening on port ${port}`);
});
