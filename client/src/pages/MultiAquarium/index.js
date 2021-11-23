import React from "react";
import { Outlet } from "react-router-dom";

import FieldCtrl from "./FieldCtrl";
import ListCtrl from "./ListCtrl";
import MultiField from "./MultiField";
import styles from "./index.module.css";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../Redux/actions/index.js";

export default function MultiAquarium(props) {
  const { rooms } = props;
  // redux에서 현재 roomId 받아오기
  const dispatch = useDispatch();
  const { roomId, selectedAlien } = useSelector(({ room }) => ({
    roomId: room.roomId,
    selectedAlien: room.selectedAlien,
  }));
  const handleSelectAlien = (alienId) => {
    dispatch(actions.selectAlien(alienId));
  };

  // console.log("[MultiAquarium]", roomId, aliens);
  console.log("selectedAlien", selectedAlien);
  return (
    <div className={styles.body}>
      <Outlet />
      <section className={styles.SecListCtrl}>
        <ListCtrl room={rooms.current && rooms.current[roomId]} />
      </section>
      <section className={styles.SecFieldCtrl}>
        <FieldCtrl room={rooms.current && rooms.current[roomId]} />
      </section>
      <section className={styles.SecField}>
        <MultiField
          room={rooms.current && rooms.current[roomId]}
          selectedAlien={selectedAlien}
          handleSelectAlien={handleSelectAlien}
        />
      </section>
    </div>
  );
}
