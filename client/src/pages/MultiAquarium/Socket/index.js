import React, { useState, useEffect } from "react";
import io from "socket.io-client";

let socket = null;
let SOCKET_URL = "http://localhost:5001";

export default function Socket() {
  useEffect(() => {
    // https://stackoverflow.com/questions/44628363/socket-io-access-control-allow-origin-error/64805972
    // socket = io(SOCKET_URL, { transports: ["websocket"] });
    socket = io(SOCKET_URL);
    socket.on("connect", () => {
      console.log("[socket] connect");
    });

    return () => {
      if (!socket) return;
      console.log("[socket] disconnect");
      socket.disconnect();
    };
  });

  return <div></div>;
}
