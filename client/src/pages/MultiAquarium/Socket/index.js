import React, { useState, useEffect } from "react";
import io from "socket.io-client";

let socket = null;
let SOCKET_URL = "http://localhost:5001";

export default function Socket(props) {
  //   console.log("socket", props.roomId);
  const { roomId, setFieldState } = props;

  function initAndJoin(roomId) {
    // https://stackoverflow.com/questions/44628363/socket-io-access-control-allow-origin-error/64805972
    // socket = io(SOCKET_URL, { transports: ["websocket"] });
    socket = io(SOCKET_URL);
    // socket.on("connect", () => {
    //   console.log("[socket] connect");
    // });
    if (socket && roomId) {
      console.log("[socket] join: roomId", roomId);
      socket.emit("join", roomId);
      socket.on("fieldState", updateFieldState);
    }
  }

  function updateFieldState(fieldState) {
    console.log("[socket] fieldState:", fieldState);
    setFieldState(fieldState);
  }

  function disconnect() {
    if (!socket) return;
    console.log("[socket] disconnect");
    socket.disconnect();
  }

  useEffect(() => {
    initAndJoin(roomId);

    return () => {
      disconnect();
    };
  }, [roomId]);

  return <div></div>;
}
