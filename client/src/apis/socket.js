import io from "socket.io-client";
let socket = null;

// temp
const SOCKET_URL =
  process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001";

export function initAndJoin(roomId) {
  // https://stackoverflow.com/questions/44628363/socket-io-access-control-allow-origin-error/64805972
  // socket = io(SOCKET_URL, { transports: ["websocket"] });
  socket = io(SOCKET_URL);
  console.log("[socket] init", SOCKET_URL);
  socket.on("connect", () => {
    console.log("[socket] connect");
  });
  if (socket && roomId) {
    console.log("[socket] join: roomId", roomId);
    socket.emit("join", roomId);
  }
}

export function disconnect() {
  if (!socket) return;
  console.log("[socket] disconnect");
  socket.disconnect();
}

export function subscribe(handler) {
  if (!socket) return;
  console.log("[socket] fieldState");
  socket.on("fieldState", handler);
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
