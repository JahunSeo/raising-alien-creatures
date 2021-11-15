import React, { useState, useEffect, useRef } from "react";

import Room from "./Room";
import Header from "./Header";
import FieldCtrl from "./FieldCtrl";
import MultiField from "./MultiField";
import api from "../../apis";
import * as socket from "../../apis/socket";
// import background from "./image/univ.jpg";
import styles from "./index.module.css";

export default function MultiAquarium() {
  const [roomIds, setRoomIds] = useState([]);
  const [currRoomId, setCurrRoomId] = useState(null);
  const rooms = useRef();

  // 챌린지 정보 가져오기
  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await api.get("/test");
        console.log("fetch test data", res.data);

        // 서버에서 데이터를 받아온 상황을 전제로 구성
        let roomIds = [1, 2, 3];

        // rooms 상태 정보
        rooms.current = {};
        roomIds.forEach((roomId) => {
          rooms.current[roomId] = new Room(roomId);
        });

        // roomIds: react에서 state로 관리할 정보
        setRoomIds(roomIds);
        setCurrRoomId(roomIds[0]);
        console.log("rooms", rooms.current);
      };
      fetchData();
    } catch (err) {
      console.error("fetchData fail", err);
    }
  }, []);

  useEffect(() => {
    // rooms가 생성되었는지 확인
    if (!rooms.current || !currRoomId) return;

    console.log("set currRoomId", currRoomId);
    socket.initAndJoin(currRoomId);
    socket.subscribe(rooms.current[currRoomId].updateFieldState);

    return () => {
      socket.disconnect();
    };
  }, [currRoomId]);

  console.log("[MultiAquarium] currRoomId", currRoomId, rooms);
  return (
    <div className={styles.body}>
      {/* <img src={background} alt="배경화면"></img> */}
      <section className={styles.SecHead}>
        <Header rooms={roomIds} roomId={currRoomId} setRoomId={setCurrRoomId} />
      </section>
      <section className={styles.SecFieldCtrl}>
        <FieldCtrl room={rooms.current && rooms.current[currRoomId]} />
      </section>
      <section className={styles.SecField}>
        <MultiField room={rooms.current && rooms.current[currRoomId]} />
      </section>
    </div>
  );
}
