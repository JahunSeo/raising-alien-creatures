import React from "react";
import { Outlet } from "react-router-dom";

import FieldCtrl from "./FieldCtrl";
import ListCtrl from "./ListCtrl";
import AlienCtrl from "./AlienCtrl";
import MultiField from "./MultiField";
import styles from "./index.module.css";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../Redux/actions/index.js";
import aquarium from "../../shared";

export default function MultiAquarium(props) {
  // redux에서 현재 roomId 받아오기
  const dispatch = useDispatch();
  const { selectedAlien } = useSelector(({ room }) => ({
    roomId: room.roomId,
    selectedAlien: room.selectedAlien,
  }));

  const handleSelectAlien = (monId) => {
    const room = aquarium.getCurrentRoom();
    if (!room) return;

    monId = Number(monId);
    dispatch(actions.selectAlien(monId));
    const alien = room.getMonster(monId);
    room.camera.setChasingTarget(alien, () => {
      dispatch(actions.selectAlien(null));
    });
  };

  // console.log("[MultiAquarium]", aliens);
  // console.log("selectedAlien", selectedAlien);

  return (
    <div className={styles.body}>
      <Outlet />
      <section className={styles.SecAlienCtrl}>
        <AlienCtrl />
      </section>
      <section className={styles.SecListCtrl}>
        <ListCtrl
          selectedAlien={selectedAlien}
          handleSelectAlien={handleSelectAlien}
        />
      </section>
      <section className={styles.SecFieldCtrl}>
        <FieldCtrl />
      </section>
      <section className={styles.SecField}>
        <MultiField
          selectedAlien={selectedAlien}
          handleSelectAlien={handleSelectAlien}
        />
      </section>
    </div>
  );
}
