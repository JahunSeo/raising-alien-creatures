// https://socket.io/docs/v4/server-initialization/
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createClient } from "redis";

import { alienDeathSchedule } from "./scheduler.js";
import * as handler from "./handler.js";

/* redis */
const rdsClient = createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db: 0,
});
rdsClient.on("error", (err) => {
  // console.log("Redis Client Error", err);
  rdsClient.connected = false;
});
rdsClient.on("connect", async () => {
  console.log("REDIS in SOCKET SERVER connected");
  rdsClient.connected = true;
});
rdsClient.connect();

/* socket */
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
  // console.log(`[connection] (clientId) ${socket.id}`);
  socket.on("join", (data) => handler.join(socket, data));
  socket.on("disconnect", (data) => handler.disconnect(socket, data));
  socket.on("send_message", (data) => handler.sendMessage(socket, data));
  socket.on("auth_request", (data) => handler.authRequest(socket, data));
  socket.on("auth_approval", (data) => handler.authApproval(socket, data));
});

/* scheduler */
alienDeathSchedule(io, rdsClient);

const port = process.env.SOCKET_PORT || 5001;

httpServer.listen(port, () => {
  console.log(`** Raising Alien Creatures Socket Server **`);
  console.log(`App listening on port ${port}`);
});
