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

io.on("connection", (socket) => {
  console.log(`[socket server] connection with ${socket.id}`);
  //   const socketId = socket.id;

  socket.on("join", (roomId) => {
    console.log(`[socket server] join ${socket.id}, ${roomId}`);
  });
});

const port = process.env.SOCKET_PORT || 5001;

httpServer.listen(port, () => {
  console.log(`** Raising Alien Creatures Socket Server **`);
  console.log(`App listening on port ${port}`);
});
