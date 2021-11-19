import React from "react";
import styles from "./index.module.css";

import SignalImage from "../../image/signal.png";

export default function Approval(props) {
  return (
    <div className={styles.body}>
      <img src={SignalImage} alt={"singal halsooedda"} />
      <h3>안될 이유가 하나 없다!</h3>
    </div>
  );
}
