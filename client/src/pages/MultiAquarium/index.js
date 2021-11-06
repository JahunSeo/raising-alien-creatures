import React, { useState, useEffect } from "react";

import MultiField from "./MultiField";
import * as api from "../../apis";
import * as socket from "../../apis/socket";

import styles from "./index.module.css";

export default function MultiAquarium() {
  const [testMsg, setTestMsg] = useState("default text");
  const [testNum, setTestNum] = useState(-1);

  // temp: selecting room
  const rooms = [1, 2, 3];
  const [roomId, setRoomId] = useState(rooms[0]);
  const [fieldState, setFieldState] = useState(null);

  // fetch test data
  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await api.get("/test");
        const data = await res.json();
        console.log(data);
        setTestMsg(data.msg);
        setTestNum(Math.round(data.body * 10000) / 10000);
      };

      fetchData();
    } catch (err) {
      console.error(err);
    }
  }, []);

  // init socket
  const updateFieldState = (fieldState) => {
    console.log("[socket] fieldState:", fieldState);
    setFieldState(fieldState);
  };

  useEffect(() => {
    socket.initAndJoin(roomId);
    socket.subscribe(updateFieldState);

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  console.log("[MultiAquarium] roomId", roomId);
  return (
    <div className={styles.body}>
      <section className={styles.SecHead}>
        <h1>Test Aquarium</h1>
        <p>{testMsg}</p>
        {/* <p>{testNum}</p> */}
        <p>Current Room: {roomId}</p>
        <div>
          {rooms.map((roomId) => (
            <button
              key={roomId}
              onClick={() => setRoomId(roomId)}
            >{`Room ${roomId}`}</button>
          ))}
        </div>
      </section>
      <section className={styles.SecField}>
        <MultiField
          seed={testNum}
          roomId={roomId}
          fieldState={fieldState}
          setFieldState={setFieldState}
        />
      </section>
    </div>
  );
}
