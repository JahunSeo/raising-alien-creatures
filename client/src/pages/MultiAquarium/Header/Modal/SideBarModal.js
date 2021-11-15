import React from "react";
import "./SideBarModal.css";
import { useSelector, useDispatch } from "react-redux";
// import SideBarModal2 from "./SideBarModal2";
import * as actions from "../../../../Redux/actions/index.js";
import PostList from "./PostList";

export default function SideBarModal() {
  const showModal1 = useSelector((state) => state.modalOnOff.showModal1);
  const dispatch = useDispatch();

  return (
    <>
      <div
        className={showModal1 ? "Background" : null}
        onClick={() => {
          dispatch(actions.showModal(false));
        }}
      />
      <div className={showModal1 ? "ModalContainer" : "hidden"}>
        <div>모달달1</div>
        <PostList />
        {/* <button
          onClick={() => {
            dispatch(actions.showModal2(true));
          }}
        >
          모달달2ㄱㄱ
        </button>
        <SideBarModal2 /> */}
      </div>
    </>
  );
}
