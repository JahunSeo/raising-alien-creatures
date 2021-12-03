import React from "react";
import styles from "./index.module.css";
import aquarium from "../../../shared";
import {AiOutlinePlus} from 'react-icons/ai'
import {AiOutlineMinus} from 'react-icons/ai'
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function FieldCtrl(props) {
  const room = aquarium.getCurrentRoom();
  return (
    <div className={styles.body}>
      <div className={styles.zoomRow}>
        <div
          className={cx("btn", "btn--zoomin")}
          onClick={() => room.camera.zoomIn()}
        >
          <AiOutlinePlus/>
        </div>
        <div
          className={cx("btn", "btn--zoomout")}
          onClick={() => room.camera.zoomOut()}
          >
          <AiOutlineMinus/>
        </div>
      </div>
    </div>
  );
}
