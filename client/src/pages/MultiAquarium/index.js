import React, { useState, useEffect } from "react";

import Socket from "./Socket";
import MultiField from "./MultiField";
import * as API from "../../apis";

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
        const res = await API.get("/test");
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

  console.log("[MultiAquarium] roomId", roomId);
  return (
    <div className={styles.body}>
      <Socket
        roomId={roomId}
        fieldState={fieldState}
        setFieldState={setFieldState}
      />
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
          fieldState={fieldState}
          setFieldState={setFieldState}
        />
      </section>
    </div>
  );
}
