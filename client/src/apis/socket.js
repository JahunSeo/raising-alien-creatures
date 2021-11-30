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

export function emitAuthRequest(info) {
  if (!socket) return;
  console.log("[socket] emitAuthRequest");
  socket.emit("auth_request", info);
}

export function onAuthRequest(handler) {
  if (!socket) return;
  console.log("[socket] onAuthRequest");
  socket.on("auth_request", handler);
}

export function emitAuthApproval(info) {
  if (!socket) return;
  console.log("[socket] emitAuthApproval");
  socket.emit("auth_approval", info);
}

export function onAuthApproval(handler) {
  if (!socket) return;
  console.log("[socket] onAuthApproval");
  socket.on("auth_approval", handler);
}

// TODO: 새로운 챌린지 참가, 졸업, 타이머에 의해 죽었을 때 처리
export function emitJoin(userinfo) {
  if (!socket) return;
  socket.emit("join_challenge", userinfo);
}
export function onJoin(handler) {
  if (!socket) return;
  socket.on("join_challenge", handler);
}
export function emitGraduate(userinfo) {
  if (!socket) return;
  socket.emit("graduate_challenge", userinfo);
}
export function onGraduate(handler) {
  if (!socket) return;
  socket.on("graduate_challenge", handler);
}

// // // // // // // // // // // // // // // // // // // //
// // // // // // // to update // // // // // // // // // //

export function usersOnRoom(handler) {
  if (!socket) return;
  console.log("[socket] usersOnRoom");
  socket.on("usersOnRoom", handler);
}
