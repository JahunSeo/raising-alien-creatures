import React from "react";
import { useParams } from "react-router-dom";
import styles from "./index.module.css";

import DeanImage from "../../image/dean.png";

export default function NewAlien(props) {
  let params = useParams();
  console.log("New Alien params", params);
  // TODO: login 상태일 때만 접근할 수 있음
  // TODO: 챌린지에 접근 가능한 유저인지 확인해주어야 함
  return (
    <div className={styles.body}>
      <img src={DeanImage} alt={"singal halsooedda"} />
      <h3>실물이 나음</h3>
    </div>
  );
}
