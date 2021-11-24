import React from "react";

import {
  // useDispatch,
  useSelector,
} from "react-redux";
// import * as actions from "../../../Redux/actions";

import styles from "./index.module.css";
// import classNames from "classnames/bind";
// const cx = classNames.bind(styles);

export default function AlienCtrl(props) {
  const { aliens, selectedAlien } = useSelector(({ room }) => ({
    aliens: room.aliens,
    selectedAlien: room.selectedAlien,
  }));

  let alien = aliens.find((a) => a.id === selectedAlien);

  return (
    <div className={styles.body}>
      <AlienBox alien={alien} />
    </div>
  );
}

function AlienBox(props) {
  const { alien } = props;
  //   console.log(alien);
  if (!alien) {
    return <p>생명체를 선택해주세요.</p>;
  } else {
    return (
      <div>
        <p>{`챌린지  : ${alien.challengeName}`}</p>
        <p>{`생명체  : ${alien.alienName}`}</p>
        <p>{`인증횟수 : ${alien.accuredAuthCnt}`}</p>
      </div>
    );
  }
}
