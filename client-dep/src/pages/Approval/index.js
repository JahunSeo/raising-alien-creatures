import React from "react";
import styles from "./index.module.css";

import SignalImage from "../../image/signal.png";

export default function Approval(props) {
  // TODO: login 상태일 때만 접근할 수 있음
  return (
    <div className={styles.body}>
      <img src={SignalImage} alt={"singal halsooedda"} />
      <h3>안될 이유가 하나 없다!</h3>
    </div>
  );
}
