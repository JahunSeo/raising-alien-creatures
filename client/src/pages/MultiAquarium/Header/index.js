import React from "react";
import styles from "./index.module.css";

import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function Header(props) {
  const { rooms, roomId, setRoomId } = props;

  return (
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
      <div className={cx("item", "itemUser")}>
        <button>로그인</button>
        <button>회원가입</button>
      </div>
    </div>
  );
}
