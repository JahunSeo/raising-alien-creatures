import React from "react";
import styles from "./index.module.css";

export default function Header(props) {
  const { rooms, roomId, setRoomId } = props;

  return (
    <div className={styles.body}>
      <h1>Test Aquarium</h1>
      <p>Current Room: {roomId}</p>
      <div>
        {rooms.map((roomId) => (
          <button
            key={roomId}
            onClick={() => setRoomId(roomId)}
          >{`Room ${roomId}`}</button>
        ))}
      </div>
    </div>
  );
}
