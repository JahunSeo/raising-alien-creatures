import React from "react";
import styles from "./index.module.css";

import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function FieldCtrl(props) {
  return (
    <div className={styles.body}>
      <div className={cx("btn", "btn--zoomin")}>+</div>
      <div className={cx("btn", "btn--zoomout")}>-</div>
    </div>
  );
}
