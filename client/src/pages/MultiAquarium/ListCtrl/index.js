import React, { useState } from "react";

import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";

import ChallengeModal from "./ChallengeModal";
import SideBarModal from "./SideBarModal";
import * as actions from "../../../Redux/actions";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function ListCtrl(props) {
  const dispatch = useDispatch();
  const { user } = useSelector(({ user }) => ({ user: user.user }));

  const [challengeModalOn, setChallengeModalOn] = useState(false);
  const showModal1 = useSelector((state) => state.modalOnOff.showModal1);
  const showModal3 = useSelector((state) => state.modalOnOff.showModal3);

  function switchModal1() {
    if (showModal3) {
      dispatch(actions.showModal3(false));
      dispatch(actions.showModal1(true));
    } else {
      dispatch(actions.showModal1(true));
    }

    if (showModal1) {
      dispatch(actions.showModal1(false));
    }
  }

  function switchModal3() {
    if (showModal1) {
      dispatch(actions.showModal1(false));
      dispatch(actions.showModal3(true));
    } else {
      dispatch(actions.showModal3(true));
    }

    if (showModal3) {
      dispatch(actions.showModal3(false));
    }
  }

  return (
    <div className={styles.body}>
      <div className={cx("btn", "btn--list")} onClick={() => switchModal1()}>
        A
      </div>
      {user && user.nickname && (
        <div
          className={cx("btn", "btn--create")}
          onClick={() => switchModal3()}
        >
          C
        </div>
      )}
      <ChallengeModal
        show={challengeModalOn}
        onHide={() => setChallengeModalOn(false)}
      />
      <SideBarModal />
    </div>
  );
}
