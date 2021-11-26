import React from "react";
import { Link, useMatch } from "react-router-dom";

import {
  // useDispatch,
  useSelector,
} from "react-redux";
// import * as actions from "../../../Redux/actions";

import styles from "./index.module.css";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function AlienCtrl(props) {
  const { user } = useSelector(({ user }) => ({
    user: user.user,
  }));
  const { aliens, selectedAlien } = useSelector(({ room }) => ({
    aliens: room.aliens,
    selectedAlien: room.selectedAlien,
  }));

  let alien = aliens.find((a) => a.id === selectedAlien);
  const challengeMatch = useMatch("/challenge/:challengeId/room");
  const userMatch = useMatch("/user/:userId/room");
  // const mainMatch = useMatch("/");

  // todo 조건 강화!
  if (!alien) {
    return (
      <div className={styles.body}>
        <p>생명체를 선택해주세요.</p>
      </div>
    );
  } else {
    return (
      <div className={styles.body}>
        <p>{`챌린지  : ${alien.challenge_name}`}</p>
        <p>{`참가자  : ${alien.user_nickname}`}</p>
        <p>{`생명체  : ${alien.alien_name} (${alien.accumulated_count}회 인증)`}</p>
        <div className={styles.btnRow}>
          {(!!userMatch || !!challengeMatch) &&
            user.login &&
            user.id === parseInt(alien.user_info_id) && (
              <button className={cx("btn", "btn--request")}>인증하기</button>
            )}
          {!!challengeMatch ? (
            <Link to={`/user/${alien.user_info_id}/room`}>
              <button className={cx("btn", "btn--room")}>개인 어항</button>
            </Link>
          ) : (
            <Link to={`/challenge/${alien.Challenge_id}/room`}>
              <button className={cx("btn", "btn--room")}>챌린지 어항</button>
            </Link>
          )}
        </div>
      </div>
    );
  }
}
