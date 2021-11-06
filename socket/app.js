// https://socket.io/docs/v4/server-initialization/
const express = require("express");
const { createServer } = require("http"); // how to initialize with https?
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const options = {}; //if needed
const io = new Server(httpServer, options);

io.on("connection", (socket) => {
  const socketId = socket.id;
  console.log(`[socket] connection with ${socketId}`);
});

const port = process.env.SOCKET_PORT || 5001;

httpServer.listen(port, () => {
  console.log(`** Raising Alien Creatures Socket Server **`);
  console.log(`App listening on port ${port}`);
});
