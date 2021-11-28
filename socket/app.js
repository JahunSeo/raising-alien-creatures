// https://socket.io/docs/v4/server-initialization/
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import * as handler from "./handler.js";

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
  console.log(`[connection] (clientId) ${socket.id}`);
  socket.on("join", (data) => handler.join(socket, data));
  socket.on("disconnect", (data) => handler.disconnect(socket, data));

  // // // // // // // // // // // // // // // // // // // //
  // // // // // // // to update // // // // // // // // // //
  socket.on("send_message", (data) => {
    console.log("Server", data);
    socket.to(data.room).emit("receive_message", data);
  });
});

const port = process.env.SOCKET_PORT || 5001;

httpServer.listen(port, () => {
  console.log(`** Raising Alien Creatures Socket Server **`);
  console.log(`App listening on port ${port}`);
});
