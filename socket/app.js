// https://socket.io/docs/v4/server-initialization/
const express = require("express");
const { createServer } = require("http"); // how to initialize with https?
const { Server } = require("socket.io");

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

const mapClientToRoom = {};
const fieldStates = {}; // TODO: build 'Room' class object

io.on("connection", (socket) => {
  console.log(`[socket server] connection with ${socket.id}`);

  socket.on("join", (roomId) => {
    console.log(`[socket server] join ${socket.id}, ${roomId}`);
    socket.join(roomId);

    // update fieldState of the room
    addClientToRoom(roomId, socket.id);

    // broadcasting to all
    io.to(roomId).emit("fieldState", fieldStates[roomId]);
  });

  socket.on("changeDestination", (data) => {
    console.log(`[socket server] changeDestination`, socket.id, data);
    const { roomId } = data;
    // update monster destination
    updateMonster(socket.id, roomId, data.monster);
    // broadcasting to all
    io.to(roomId).emit("fieldState", fieldStates[roomId]);
  });

  socket.on("disconnect", () => {
    console.log(`[socket server] disconnect ${socket.id}`);
    // update fieldState of the room
    const roomId = mapClientToRoom[socket.id];
    const notEmpty = removeClientFromRoom(socket.id, roomId);

    // broadcasting to all
    if (notEmpty) io.to(roomId).emit("fieldState", fieldStates[roomId]);
  });
});

const port = process.env.SOCKET_PORT || 5001;

httpServer.listen(port, () => {
  console.log(`** Raising Alien Creatures Socket Server **`);
  console.log(`App listening on port ${port}`);
});

//////////////////////////////////////////////

function initFieldState(roomId) {
  console.log("initFieldState", roomId);
  // validation check
  if (!fieldStates || !!fieldStates[roomId]) return false;
  // init field
  // TODO: 서버에서 해당 어항에 포함된 몬스터들을 가져오기
  const state = {
    monsters: [],
  };
  fieldStates[roomId] = state;
}

function addClientToRoom(roomId, socketId) {
  if (!fieldStates[roomId]) {
    initFieldState(roomId);
  }
  // add client to room
  // generate random monster
  let randRange = 300;
  let x = (Math.random() - 0.5) * randRange;
  let y = (Math.random() - 0.5) * randRange;
  const monster = {
    socketId, // TODO: user id or email
    position: { x, y },
    destination: { x, y },
    size: 50 + Math.random() * 100,
    color: getRandomColor(),
  };
  fieldStates[roomId].monsters.push(monster);
  mapClientToRoom[socketId] = roomId;
}

function removeClientFromRoom(socketId, roomId) {
  if (!fieldStates[roomId]) {
    return false;
  }
  const monsters = fieldStates[roomId].monsters.filter(
    (mon) => mon.socketId !== socketId
  );
  delete mapClientToRoom[socketId];
  if (monsters.length === 0) {
    delete fieldStates[roomId];
    return false;
  } else {
    fieldStates[roomId].monsters = monsters;
    return roomId;
  }
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function updateMonster(socketId, roomId, monster) {
  const newMonsters = fieldStates[roomId].monsters.map((_mon) => {
    if (_mon.socketId !== socketId) return _mon;
    let newMonster = {
      ..._mon,
      ...monster,
    };
    return newMonster;
  });
  fieldStates[roomId].monsters = newMonsters;
}
