import React from "react";
import { useSelector } from "react-redux";
// import api from "../../apis";
import { Link, useMatch, Navigate } from "react-router-dom";
import styles from "./index.module.css";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function Title(props) {
  // redux에서 user정보 받아오기
  const { user } = useSelector(({ user }) => ({ user: user.user }));
  const { roomTitle, challenge } = useSelector(({ room }) => ({
    roomTitle: room.roomTitle,
    challenge: room.challenge,
  }));
  // url 확인하기
  const userMatch = useMatch("/user/:userId/room");
  const challengeMatch = useMatch("/challenge/:challengeId/room");
  const newchalMatch = useMatch("/challenge/new");
  const alienMatch = useMatch("/challenge/:challengeId/join");
  const approvalMatch = useMatch("/approval");
  const mainMatch = useMatch("/");

  if (!!userMatch) {
    return <div className={styles.title}>{roomTitle}</div>;
  } else if (!!challengeMatch) {
    let { params } = challengeMatch;
    let { challengeId } = params;

    // 챌린지 풀방인지 확인

    // 본 챌린지에 참가중인지 확인
    let participating;
    if (user.login && user.challenges) {
      participating =
        user.challenges.findIndex((c) => c.id === Number(challengeId)) !== -1;
    }
    return (
      <React.Fragment>
        <div className={styles.title}>{roomTitle}</div>
        {user.login && participating && (
          <div className={cx("btn", "btn--ing")}>참가중</div>
        )}
        {user.login &&
          !participating &&
          challenge.participant_number < challenge.maximum_number && (
            <Link to={`/challenge/${challengeId}/join`}>
              <button className={cx("btn", "btn--start")}>시작하기</button>
            </Link>
          )}
        {user.login &&
          !participating &&
          !(challenge.participant_number < challenge.maximum_number) && (
            <div className={cx("btn--full")}>
              <div>
                풀방 {challenge.participant_number}/{challenge.maximum_number}
              </div>
            </div>
          )}
      </React.Fragment>
    );
  } else if (!!newchalMatch) {
    if (!user.login) return <Navigate to="/" />;
    return <div className={styles.title}>{`New Challenge`}</div>;
  } else if (!!alienMatch) {
    let { params } = alienMatch;
    let { challengeId } = params;
    // 본 챌린지에 참가중인지 확인
    let participating;
    if (user.login && user.challenges) {
      participating =
        user.challenges.findIndex((c) => c.id === Number(challengeId)) !== -1;
    }
    if (!user.login || participating) {
      return <Navigate to={`/challenge/${challengeId}/room`} />;
    }
    return <div className={styles.title}>{roomTitle}</div>;
  } else if (!!approvalMatch) {
    if (!user.login) return <Navigate to="/" />;
    return <div className={styles.title}>{`Approval`}</div>;
  } else if (!!mainMatch) {
    return <div className={styles.title}>{roomTitle}</div>;
  } else {
    return <div className={styles.title}>{roomTitle}</div>;
  }
}
