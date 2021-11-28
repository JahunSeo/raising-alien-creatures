import React from "react";
import { Link, useMatch } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../Redux/actions";

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
  const { user, aliens, selectedAlien } = useSelector(({ user, room }) => ({
    user: user.user,
    aliens: room.aliens,
    selectedAlien: room.selectedAlien,
  }));

  let alien = aliens.find((a) => a.id === selectedAlien);

  const challengeMatch = useMatch("/challenge/:challengeId/room");
  const userMatch = useMatch("/user/:userId/room");
  // const mainMatch = useMatch("/");

  const dispatch = useDispatch();

  // todo 조건 강화!
  if (!alien) {
    return (
      <div className={cx("body")}>
        <p>생명체를 선택해주세요.</p>
      </div>
    );
  } else {
    const todayValue = new Date().getDay();
    const isPracticeDay = !!alien[DAY_TEXT[todayValue].en];

    return (
      <div className={cx("body", "body--selected")}>
        <div className={cx("row")}>
          <h3 className={styles.challengeName}>{`${alien.challenge_name}`}</h3>
        </div>
        <div className={cx("row")}>
          <p className={styles.userName}>
            {`${alien.user_nickname}`}
            <span className={styles.authCnt}>
              {` (${alien.accumulated_count}회 인증)`}
            </span>
          </p>
        </div>
        <ul className={styles.daylist}>
          {[0, 1, 2, 3, 4, 5, 6].map((day) => {
            let dayType = "default";
            if (!!alien[DAY_TEXT[day].en]) dayType = "selected";
            if (day === todayValue && isPracticeDay) dayType = "today";
            // if (!!alien[day] && (new Date()).getDay() = )
            return (
              <li key={day} className={cx("day", `day--${dayType}`)}>
                {DAY_TEXT[day].kr}
              </li>
            );
          })}
        </ul>
        <div className={styles.btnRow}>
          {!challengeMatch && (
            <Link to={`/challenge/${alien.challenge_id}/room`}>
              <p className={cx("btn")}>챌린지 어항</p>
            </Link>
          )}
          {!userMatch && (
            <Link to={`/user/${alien.user_info_id}/room`}>
              <p className={cx("btn")}>참가자 어항</p>
            </Link>
          )}
          {!!userMatch &&
            user.login &&
            user.id === parseInt(alien.user_info_id) && (
              <PracticeBtn
                alien={alien}
                isPracticeDay={isPracticeDay}
                handleClick={() => dispatch(actions.showAuthRequest(true))}
              />
            )}
        </div>
      </div>
    );
  }
}

function PracticeBtn(props) {
  const { alien, handleClick, isPracticeDay } = props;
  if (alien.alien_status === 1) {
    // 졸업
    return <p className={cx("btn", "btn--graduated", "btn--disabled")}>졸업</p>;
  } else if (alien.practice_status === 1) {
    // 승인 대기
    return (
      <p className={cx("btn", "btn--ready", "btn--disabled")}>승인 대기</p>
    );
  } else if (alien.practice_status === 2 || !isPracticeDay) {
    // 인증 완료
    return (
      <p className={cx("btn", "btn--complete", "btn--disabled")}>인증 완료</p>
    );
  } else {
    // 인증하기
    return (
      <p className={cx("btn")} onClick={handleClick}>
        인증하기
      </p>
    );
  }
}
