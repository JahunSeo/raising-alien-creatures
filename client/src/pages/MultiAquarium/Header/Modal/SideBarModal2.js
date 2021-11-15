import React from "react";
import "./SideBarModal2.css";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../Redux/actions/index.js";

export default function SideBarModal2() {
  const showModal2 = useSelector((state) => state.modalOnOff.showModal2);
  const dispatch = useDispatch();
  return (
    <>
      <div
        className={showModal2 ? "Background2" : null}
        onClick={() => {
          dispatch(actions.showModal2(false));
        }}
      />
      <div>
        <div className={showModal2 ? "ModalContainer2" : "hidden2"}></div>
      </div>
    </>
  );
}
