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
    console.log("[socket] join", userinfo.id);
    socket.emit("join", userinfo);
  }
}

export function disconnect(roomId) {
  if (!socket) return;
  console.log("[socket] disconnect", roomId);
  socket.disconnect();
}

// // // // // // // // // // // // // // // // // // // //
// // // // // // // to update // // // // // // // // // //

export function messageSend(message) {
  if (!socket) return;

  socket.emit("send_message", message, (response) => {
    console.log(response);
    console.log("HI");
  });
}

export function messageReceive(handler) {
  if (!socket) return;
  socket.on("receive_message", handler);
}

// export function subscribe(handler) {
//   if (!socket) return;
//   console.log("[socket] fieldState");
//   socket.on("fieldState", handler);
// }
export function usersOnRoom(handler) {
  if (!socket) return;
  console.log("[socket] usersOnRoom");
  socket.on("usersOnRoom", handler);
}
