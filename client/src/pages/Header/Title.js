import React from "react";
import { useSelector } from "react-redux";
import { Link, useMatch, Navigate } from "react-router-dom";

import styles from "./index.module.css";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function Title(props) {
  // redux에서 user정보 받아오기
  const { user } = useSelector(({ user }) => ({ user: user.user }));
  const { roomTitle } = useSelector(({ room }) => ({
    roomTitle: room.roomTitle,
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
    // 본 챌린지에 참가중인지 확인
    let participating;
    if (user.login && user.challenges) {
      participating =
        user.challenges.findIndex((e) => e.id === Number(challengeId)) !== -1;
    }
    // console.log(challengeId, participating, user.challenges);
    return (
      <React.Fragment>
        <div className={styles.title}>{roomTitle}</div>
        {user.login && participating && (
          <div className={cx("btn", "btn--ing")}>참가중</div>
        )}
        {user.login && !participating && (
          <Link to={`/challenge/${challengeId}/join`}>
            <button className={cx("btn", "btn--start")}>시작하기</button>
          </Link>
        )}
      </React.Fragment>
    );
  } else if (!!newchalMatch) {
    if (!user.login) return <Navigate to="/" />;
    return <div className={styles.title}>{`New Challenge`}</div>;
  } else if (!!alienMatch) {
    let { params } = alienMatch;
    if (!user.login) {
      // TODO: 이미 참가중인 경우 처리
      return <Navigate to={`/challenge/${params.challengeId}/room`} />;
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
