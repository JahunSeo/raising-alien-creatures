import React, { userEffect, useState } from "react";
// import ScrollToBottom from "react-scroll-to-bottom";
import "./ChatModal.css";
import {
  useSelector,
  // useDispatch
} from "react-redux";
// import * as actions from "../../../../Redux/actions/index.js";
// import api from "../../../../apis/index.js";

const ChallengeModal = (props) => {
  const { chalInfoModal } = useSelector(({ modalOnOff }) => ({
    chalInfoModal: modalOnOff.chalInfoModal,
  }));
  const { modalType } = props;
  const toggle = modalType && chalInfoModal === modalType;
  // const dispatch = useDispatch();

  return (
    <div className={toggle ? "ChallengeContainer" : "hidden"}>
      <h1>Chat</h1>
    </div>
  );
};

export default ChallengeModal;
