import React from "react";
import "./SideBarModal.css";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import SideBarModal2 from "../SideBarModal2";
import PostList from "../PostList";

export default function SideBarModal() {
  const showModal1 = useSelector((state) => state.modalOnOff.showModal1);

  return (
    <>
      {/* <div
        className={showModal1 ? "Background" : null}
        onClick={() => {
          dispatch(actions.showModal1(false));
        }}
      /> */}
      <div className={showModal1 ? "ModalContainer" : "hidden"}>
        <Routes>
          <Route path="/" element={<PostList type="main" />}></Route>
          <Route
            path="/user/:userId"
            element={<PostList type="personal" />}
          ></Route>
          <Route
            path="/challenge/:challengeId"
            element={<PostList type="challenge" />}
          ></Route>
        </Routes>
        {/* <button
          onClick={() => {
            dispatch(actions.showModal2(true));
          }}
        >
          모달달2ㄱㄱ
        </button> */}
        <SideBarModal2 />
      </div>
    </>
  );
}
