import React from "react";
import styles from "./index.module.css";
import aquarium from "../../../shared";
import { BiZoomIn, BiZoomOut } from "react-icons/bi";
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
          <BiZoomIn size={23} />
        </div>
        <div
          className={cx("btn", "btn--zoomout")}
          onClick={() => room.camera.zoomOut()}
        >
          <BiZoomOut size={23} />
        </div>
      </div>
    </div>
  );
}
