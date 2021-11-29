import io from "socket.io-client";
let socket = null;

const SOCKET_URL =
  process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001";

export function init(userinfo) {
  socket = io(SOCKET_URL);
  console.log("[socket] init", SOCKET_URL);
  socket.on("connect", () => {
    console.log("[socket] connect");
  });
  if (socket && userinfo.id && userinfo.challenges) {
    console.log("[socket] join", userinfo.id, userinfo.challenges);
    socket.emit("join", userinfo);
  }
}

export function disconnect(roomId) {
  if (!socket) return;
  console.log("[socket] disconnect", roomId);
  socket.disconnect();
}

export function sendMessage(message) {
  if (!socket) return;
  socket.emit("send_message", message);
}

export function receiveMessage(handler) {
  console.log("[socket] receiveMessage");
  if (!socket) return;
  socket.on("receive_message", handler);
}

export function blockMessage() {
  if (!socket) return;
  console.log("[socket] blockMessage");
  socket.off("receive_message");
}

// // // // // // // // // // // // // // // // // // // //
// // // // // // // to update // // // // // // // // // //

export function usersOnRoom(handler) {
  if (!socket) return;
  console.log("[socket] usersOnRoom");
  socket.on("usersOnRoom", handler);
}
