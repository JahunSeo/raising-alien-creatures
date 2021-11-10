import React, { useState, useEffect } from "react";

import Header from "./Header";
import FieldCtrl from "./FieldCtrl";
import MultiField from "./MultiField";
import * as api from "../../apis";
import * as socket from "../../apis/socket";

import styles from "./index.module.css";

export default function MultiAquarium() {
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
        setTestNum(Math.round(data.body * 10000) / 10000);
      };
      fetchData();
    } catch (err) {
      console.error(err);
    }
  }, []);

  // init socket
  const updateFieldState = (fieldState) => {
    const monsterLength = Object.keys(fieldState.monsters).length;
    // console.log("[socket] fieldState:", monsterLength);
    if (monsterLength <= 0) {
      console.error("ERROR!! zero monster issue should be fixed!!");
      return;
    }
    setFieldState(fieldState);
  };

  useEffect(() => {
    socket.initAndJoin(roomId);
    socket.subscribe(updateFieldState);

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  // console.log("[MultiAquarium] roomId", roomId);
  return (
    <div className={styles.body}>
      <section className={styles.SecHead}>
        <Header rooms={rooms} roomId={roomId} setRoomId={setRoomId} />
      </section>
      <section className={styles.SecFieldCtrl}>
        <FieldCtrl />
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
