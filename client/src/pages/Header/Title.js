import React from "react";
import { useSelector } from "react-redux";
import { Link, useMatch } from "react-router-dom";

import styles from "./index.module.css";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function Title(props) {
  // redux에서 user정보 받아오기
  const { user } = useSelector(({ user }) => ({ user: user.user }));
  //   console.log(123, user);
  // url 확인하기
  const userMatch = useMatch("/user/:userId/room");
  const challengeMatch = useMatch("/challenge/:challengeId/room");
  const newchalMatch = useMatch("/challenge/new");
  const alienMatch = useMatch("/challenge/:challengeId/join");
  const approvalMatch = useMatch("/approval");
  const mainMatch = useMatch("/");

  // console.log(
  //   userMatch,
  //   challengeMatch,
  //   newchalMatch,
  //   alienMatch,
  //   approvalMatch,
  //   mainMatch
  // );
  if (!!userMatch) {
    let { params } = userMatch;
    return <div className={styles.title}>{`User-${params.userId}`}</div>;
  } else if (!!challengeMatch) {
    let { params } = challengeMatch;
    let { challengeId } = params;
    // 본 챌린지에 참가중인지 확인
    let participating;
    if (user && user.challenges) {
      participating =
        user.challenges.findIndex(
          (e) => e.Challenge_id === Number(challengeId)
        ) !== -1;
    }
    return (
      <React.Fragment>
        <div className={styles.title}>{`Challenge-${params.challengeId}`}</div>
        {!!user && participating && (
          <div className={cx("btn", "btn--ing")}>참가중</div>
        )}
        {!!user && !participating && (
          <Link to={`/challenge/${challengeId}/join`}>
            <button className={cx("btn", "btn--start")}>시작하기</button>
          </Link>
        )}
      </React.Fragment>
    );
  } else if (!!newchalMatch) {
    return <div className={styles.title}>{`New Challenge`}</div>;
  } else if (!!alienMatch) {
    let { params } = alienMatch;
    return (
      <div className={styles.title}>{`Challenge-${params.challengeId}`}</div>
    );
  } else if (!!approvalMatch) {
    return <div className={styles.title}>{`Approval`}</div>;
  } else if (!!mainMatch) {
    return <div className={styles.title}>{`Plaza`}</div>;
  } else {
    return <div className={styles.title}>{`Plaza`}</div>;
  }
}
