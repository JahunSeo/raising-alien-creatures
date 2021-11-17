import React, { useState, useRef } from "react";
import { Routes, Route } from "react-router-dom";

import PlazaRoom from "./Room/PlazaRoom";
import UserRoom from "./Room/UserRoom";
import ChallengeRoom from "./Room/ChallengeRoom";

import Header from "./Header";
import FieldCtrl from "./FieldCtrl";
import MultiField from "./MultiField";
import styles from "./index.module.css";
import { useDispatch } from "react-redux";
import * as actions from "../../Redux/actions";

export default function MultiAquarium() {
  const rooms = useRef();
  const [roomInfo, setRoomInfo] = useState({ roomId: null, aliens: [] });

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
          element={<ChallengeRoom rooms={rooms} setRoomInfo={setRoomInfo} />}
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
