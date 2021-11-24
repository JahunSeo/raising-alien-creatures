import io from "socket.io-client";
let socket = null;

// temp
const SOCKET_URL =
  process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001";

export function initAndJoin(info) {
  // https://stackoverflow.com/questions/44628363/socket-io-access-control-allow-origin-error/64805972
  // socket = io(SOCKET_URL, { transports: ["websocket"] });
  socket = io(SOCKET_URL);
  console.log("[socket] init", SOCKET_URL);
  socket.on("connect", () => {
    console.log("[socket] connect");
  });
  if (socket && info.roomId) {
    console.log("[socket] join", info);
    socket.emit("join", info);
  }
}

export function disconnect(roomId) {
  if (!socket) return;
  console.log("[socket] disconnect", roomId);
  socket.disconnect();
}

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

export function changeDestination(roomId, destination) {
  if (!socket) return;
  console.log("[socket] changeDestination");
  let monster = {
    destination,
    // temp
    // location: destination,
  };
  socket.emit("changeDestination", { roomId, monster });
}
