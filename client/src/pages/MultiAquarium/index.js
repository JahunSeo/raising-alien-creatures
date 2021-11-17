import React, { useRef } from "react";
import { Routes, Route } from "react-router-dom";

import PlazaRoom from "./Room/PlazaRoom";
import UserRoom from "./Room/UserRoom";
import ChallengeRoom from "./Room/ChallengeRoom";

import Header from "./Header";
import FieldCtrl from "./FieldCtrl";
import MultiField from "./MultiField";
import styles from "./index.module.css";
import { useSelector } from "react-redux";

export default function MultiAquarium() {
  const rooms = useRef();
  // redux에서 현재 roomId 받아오기
  const {roomId} = useSelector(({room}) =>({ roomId : room.roomId }))

  return (
    <div className={styles.body}>
      <Routes>
        <Route
          path="/"
          element={<PlazaRoom rooms={rooms} />}
        ></Route>
        <Route
          path="/user/:userId"
          element={<UserRoom rooms={rooms} />}
        ></Route>
        <Route
          path="/challenge/:challengeId"
          element={<ChallengeRoom rooms={rooms} />}
        ></Route>
      </Routes>

      <section className={styles.SecHead}>
        <Header roomId={roomId} />
      </section>
      <section className={styles.SecFieldCtrl}>
        <FieldCtrl room={rooms.current && rooms.current[roomId]} />
      </section>
      <section className={styles.SecField}>
        <MultiField room={rooms.current && rooms.current[roomId]} />
      </section>
    </div>
  );
}
