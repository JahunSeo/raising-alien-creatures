import React from "react";
import "./SideBarModal.css";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import PostList from "../PostList";

export default function SideBarModal(props) {
  const { chalInfoModal } = useSelector(({ modalOnOff }) => ({
    chalInfoModal: modalOnOff.chalInfoModal,
  }));
  const { modalType, handleSelectAlien } = props;
  const toggle = modalType && chalInfoModal === modalType;

  return (
    <>
      <div className={toggle ? "ModalContainer" : "hidden"}>
        <Routes>
          <Route
            path="/"
            element={
              <PostList type="main" handleSelectAlien={handleSelectAlien} />
            }
          ></Route>
          <Route
            path="/user/:userId/room"
            element={
              <PostList type="personal" handleSelectAlien={handleSelectAlien} />
            }
          ></Route>
          <Route
            path="/challenge/:challengeId/room"
            element={
              <PostList
                type="challenge"
                handleSelectAlien={handleSelectAlien}
              />
            }
          ></Route>
        </Routes>
      </div>
    </>
  );
}
