import React from "react";
import styles from "./index.module.css";

import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function FieldCtrl(props) {
  const { room } = props;

  return (
    <div className={styles.body}>
      <div className={styles.zoomRow}>
        <div
          className={cx("btn", "btn--zoomin")}
          onClick={() => room.camera.zoomIn()}
        >
          +
        </div>
        <div
          className={cx("btn", "btn--zoomout")}
          onClick={() => room.camera.zoomOut()}
        >
          -
        </div>
      </div>
    </div>
  );
}
