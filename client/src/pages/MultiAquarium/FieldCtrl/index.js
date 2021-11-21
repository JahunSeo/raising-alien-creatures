import React from "react";
import styles from "./index.module.css";

import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../Redux/actions/index.js";

import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function FieldCtrl(props) {
  const { room } = props;
  const dispatch = useDispatch();

  const { selectedAlien } = useSelector(({ room }) => ({
    selectedAlien: room.selectedAlien,
  }));
  const handleFocus = () => dispatch(actions.selectAlien(null));

  return (
    <div className={styles.body}>
      <div className={styles.focusRow}>
        <div
          className={cx("btn", "btn--focus", selectedAlien && "btn--focusOn")}
          onClick={() => handleFocus()}
        >
          {"Φ"}
        </div>
      </div>
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
