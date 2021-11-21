import React, { useState } from "react";

import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";

import ChallengeModal from "./ChallengeModal";
import SideBarModal from "./SideBarModal";
import * as actions from "../../../Redux/actions";
import { CHAL_INFO_TYPE } from "../../../Redux/reducers/modalOnOff";

import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function ListCtrl(props) {
  const dispatch = useDispatch();
  // const { user } = useSelector(({ user }) => ({ user: user.user }));
  const { chalInfoModal } = useSelector(({ modalOnOff }) => ({
    chalInfoModal: modalOnOff.chalInfoModal,
  }));

  function switchModal(modalType) {
    if (modalType === chalInfoModal) {
      dispatch(actions.setChalInfoModal(null));
    } else {
      dispatch(actions.setChalInfoModal(modalType));
    }
  }

  return (
    <div className={styles.body}>
      <div
        className={cx("btn", "btn--list")}
        onClick={() => switchModal(CHAL_INFO_TYPE.ALIEN)}
      >
        A
      </div>
      <div
        className={cx("btn", "btn--create")}
        onClick={() => switchModal(CHAL_INFO_TYPE.CHAT)}
      >
        C
      </div>
      <SideBarModal modalType={CHAL_INFO_TYPE.ALIEN} />
      <ChallengeModal modalType={CHAL_INFO_TYPE.CHAT} />
    </div>
  );
}
