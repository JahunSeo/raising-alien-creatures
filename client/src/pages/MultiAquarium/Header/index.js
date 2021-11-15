import React, { useState } from "react";
import styles from "./index.module.css";
import SideBarModal from "./Modal/SideBarModal.js";
import { useDispatch } from "react-redux";
import * as actions from "../../../Redux/actions/index.js";

import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function Header(props) {
  const { rooms, roomId, setRoomId } = props;
  const dispatch = useDispatch();

  return (
    <>
      <div className={styles.body}>
        <div className={cx("item", "itemTitle")}>
          <h1 className={styles.title}>{`Aquarium: ROOM ${roomId}`}</h1>
        </div>
        <div className={cx("item", "itemRoom")}>
          {rooms.map((roomId) => (
            <button
              key={roomId}
              onClick={() => setRoomId(roomId)}
            >{`Room ${roomId}`}</button>
          ))}
        </div>
        <div className={cx("item", "itemHistory")}>
          {/* <button onClick={openModal}>나의 기록</button> */}
          <button
            onClick={() => {
              // dispatch({ type: "SHOW_MODAL1" });
              dispatch(actions.showModal(true));
            }}
          >
            나의 기록
          </button>
        </div>

        <div className={cx("item", "itemUser")}>
          <button>로그인</button>
          <button>회원가입</button>
        </div>
      </div>
      <SideBarModal />
    </>
  );
}
