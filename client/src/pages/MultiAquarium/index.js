import React, { useState, useEffect, useRef } from "react";

import Room from "../../shared/room/RoomClient";
import Header from "./Header";
import FieldCtrl from "./FieldCtrl";
import MultiField from "./MultiField";
import api from "../../apis";
import * as socket from "../../apis/socket";
// import background from "./image/univ.jpg";
import styles from "./index.module.css";

export default function MultiAquarium() {
  const [currRoomId, setCurrRoomId] = useState(null);
  const rooms = useRef();

  const [aliens, setAliens] = useState([]);

  // 챌린지 정보 가져오기
  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await api.get("/main");
        console.log("fetch main data", res.data);
        if (res.data.result === "success") {
          // 서버에서 데이터를 받아온 상황을 전제로 구성
          let roomId = "plaza";

          // rooms 상태 정보
          rooms.current = {};
          rooms.current[roomId] = new Room(roomId);
          rooms.current[roomId].initMonsters(res.data.data);

          // roomIds: react에서 state로 관리할 정보
          setCurrRoomId(roomId);
          //
          setAliens(res.data.data);
          console.log("rooms", rooms.current);
        } else {
        }
      };
      fetchData();
    } catch (err) {
      console.error("fetchData fail", err);
    }
  }, []);

  useEffect(() => {
    // rooms가 생성되었는지 확인
    if (!rooms.current || !currRoomId) return;

    // 해당 room에 조인
    console.log("set currRoomId", currRoomId);
    // socket.initAndJoin(currRoomId);
    // socket.subscribe(rooms.current[currRoomId].syncFieldState);
    // room의 update logic start
    rooms.current[currRoomId].start();

    return () => {
      // socket.disconnect();
      rooms.current[currRoomId].close();
    };
  }, [currRoomId]);

  console.log("[MultiAquarium] currRoomId", currRoomId, rooms);
  return (
    <div className={styles.body}>
      {/* <img src={background} alt="배경화면"></img> */}
      <section className={styles.SecHead}>
        <Header roomId={currRoomId} setRoomId={setCurrRoomId} />
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
