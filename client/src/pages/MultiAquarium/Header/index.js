import React, { useState } from "react";
import styles from "./index.module.css";
import SideBarModal from "./Modal/SideBarModal.js";

import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function Header(props) {
  const { rooms, roomId, setRoomId } = props;

  // 모달창
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  }
  const closeModal = () => {
    setShowModal(false);
  }

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
            // >{{roomId} === 1 ? ("개인 행성") :(`${roomId}`)}</button>
          ))}
        </div>
        <div className={cx("item","itemHistory")}>
          <button onClick={openModal}>나의 기록</button>
        </div>
        
        
        <div className={cx("item", "itemUser")}>
          <button>로그인</button>
          <button>회원가입</button>
        </div>
      </div>
      <SideBarModal showModal={showModal} closeModal={closeModal} ></SideBarModal>
    </>
  );
}
