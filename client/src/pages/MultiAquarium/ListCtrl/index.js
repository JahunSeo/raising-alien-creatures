import React from "react";
import { useMatch } from "react-router-dom";
import styles from "./index.module.css";

import SideBarModal from "./SideBarModal";
import ChatModal from "./ChatModal";

import { useDispatch, useSelector } from "react-redux";
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

  const challengeMatch = useMatch("/challenge/:challengeId/room");
  const mainMatch = useMatch("/");
  if (!!mainMatch) {
    return <div></div>;
  }

  return (
    <div className={styles.body}>
      <div
        className={cx("btn", "btn--list")}
        onClick={() => switchModal(CHAL_INFO_TYPE.ALIEN)}
      >
        A
      </div>
      {!!challengeMatch && (
        <div
          className={cx("btn", "btn--chat")}
          onClick={() => switchModal(CHAL_INFO_TYPE.CHAT)}
        >
          C
        </div>
      )}
      <SideBarModal modalType={CHAL_INFO_TYPE.ALIEN} />
      <ChatModal modalType={CHAL_INFO_TYPE.CHAT} />
    </div>
  );
}
