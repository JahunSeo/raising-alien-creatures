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

const DAY_TEXT = {
  0: { en: "sun", kr: "일" },
  1: { en: "mon", kr: "월" },
  2: { en: "tue", kr: "화" },
  3: { en: "wed", kr: "수" },
  4: { en: "thu", kr: "목" },
  5: { en: "fri", kr: "금" },
  6: { en: "sat", kr: "토" },
};

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
  const todayValue = new Date().getDay();
  console.log(1212, todayValue, alien);

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
        <div className={cx("row")}>
          <Link to={`/challenge/${alien.challenge_id}/room`}>
            <h3
              className={styles.challengeName}
            >{`${alien.challenge_name}`}</h3>
          </Link>
        </div>
        <div className={cx("row")}>
          <Link to={`/user/${alien.user_info_id}/room`}>
            <p className={styles.userName}>
              {`${alien.user_nickname}`}
              <span className={styles.authCnt}>
                {` (${alien.accumulated_count}회 인증)`}
              </span>
            </p>
          </Link>
        </div>
        <ul className={styles.daylist}>
          {[0, 1, 2, 3, 4, 5, 6].map((day) => {
            let dayType = "default";
            console.log(111, alien[DAY_TEXT[day].en]);

            if (!!alien[DAY_TEXT[day].en]) dayType = "selected";
            if (!!alien[DAY_TEXT[day].en] && day === todayValue)
              dayType = "today";
            // if (!!alien[day] && (new Date()).getDay() = )
            return (
              <li key={day} className={cx("day", `day--${dayType}`)}>
                {DAY_TEXT[day].kr}
              </li>
            );
          })}
        </ul>
        <div className={styles.btnRow}>
          <button className={cx("btn", "btn--request")}>챌린지 어항</button>
          <button className={cx("btn", "btn--request")}>참가자 어항</button>
          {(!!userMatch || !!challengeMatch) &&
            user.login &&
            user.id === parseInt(alien.user_info_id) && (
              <button className={cx("btn", "btn--request")}>인증</button>
            )}
          {/* {!!challengeMatch ? (
            <Link to={`/user/${alien.user_info_id}/room`}>
              <button className={cx("btn", "btn--room")}>개인 어항</button>
            </Link>
          ) : (
            <Link to={`/challenge/${alien.challenge_id}/room`}>
              <button className={cx("btn", "btn--room")}>챌린지 어항</button>
            </Link>
          )} */}
        </div>
      </div>
    );
  }
}
