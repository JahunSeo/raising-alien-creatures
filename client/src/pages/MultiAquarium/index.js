import React, { useState, useRef } from "react";
import { Routes, Route } from "react-router-dom";

import PlazaRoom from "./Room/PlazaRoom";
import UserRoom from "./Room/UserRoom";

import Header from "./Header";
import FieldCtrl from "./FieldCtrl";
import MultiField from "./MultiField";
// import * as socket from "../../apis/socket";
import styles from "./index.module.css";
import { useDispatch } from "react-redux";
import * as actions from "../../Redux/actions";

export default function MultiAquarium() {
  const rooms = useRef();
  const [roomInfo, setRoomInfo] = useState({ roomId: null, aliens: [] });

  // 주의! 아직 지우지 말기! 챌린지 리스트 그릴 때 소켓 방식 활용해야 함
  // useEffect(() => {
  //   // rooms가 생성되었는지 확인
  //   if (!rooms.current || !currRoomId) return;

  //   // 해당 room에 조인
  //   console.log("set currRoomId", currRoomId);
  //   // socket.initAndJoin(currRoomId);
  //   // socket.subscribe(rooms.current[currRoomId].syncFieldState);
  //   // room의 update logic start
  //   rooms.current[currRoomId].start();

  //   return () => {
  //     // socket.disconnect();
  //     rooms.current[currRoomId].close();
  //   };
  // }, [currRoomId]);

  console.log(
    "[MultiAquarium] roomId",
    roomInfo.roomId
    // rooms.current && rooms.current[roomInfo.roomId]
  );
  return (
    <div className={styles.body}>
      <Routes>
        <Route
          path="/"
          element={<PlazaRoom rooms={rooms} setRoomInfo={setRoomInfo} />}
        ></Route>
        <Route
          path="/user/:userId"
          element={<UserRoom rooms={rooms} setRoomInfo={setRoomInfo} />}
        ></Route>
        <Route
          path="/challenge/:challengeId"
          element={<PlazaRoom rooms={rooms} setRoomInfo={setRoomInfo} />}
        ></Route>
      </Routes>

      <section className={styles.SecHead}>
        <Header roomId={roomInfo.roomId} />
      </section>
      <section className={styles.SecFieldCtrl}>
        <FieldCtrl room={rooms.current && rooms.current[roomInfo.roomId]} />
      </section>
      <section className={styles.SecField}>
        <MultiField room={rooms.current && rooms.current[roomInfo.roomId]} />
      </section>
    </div>
  );
}
