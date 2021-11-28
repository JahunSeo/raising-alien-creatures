import React, { useRef } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import Header from "./pages/Header";
import Approval from "./pages/Approval";
import NewChallenge from "./pages/NewChallenge";
import NewAlien from "./pages/NewAlien";

import MultiAquarium from "./pages/MultiAquarium";

import PlazaRoom from "./pages/MultiAquarium/Room/PlazaRoom";
import UserRoom from "./pages/MultiAquarium/Room/UserRoom";
import ChallengeRoom from "./pages/MultiAquarium/Room/ChallengeRoom";

import PopUp from "./pages/PopUp";

import styles from "./App.module.css";

function App() {
  const rooms = useRef();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="approval" element={<Approval />} />
          <Route path="challenge/new" element={<NewChallenge />} />
          <Route path="challenge/:challengeId/join" element={<NewAlien />} />
          <Route path="/" element={<MultiAquarium rooms={rooms} />}>
            <Route path="" element={<PlazaRoom rooms={rooms} />} />
            <Route
              path="user/:userId/room"
              element={<UserRoom rooms={rooms} />}
            />
            <Route
              path="challenge/:challengeId/room"
              element={<ChallengeRoom rooms={rooms} />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout() {
  const { user } = useSelector(({ user }) => ({ user: user.user }));
  const { roomId } = useSelector(({ room }) => ({
    roomId: room.roomId,
  }));
  // const popupModal = false;
  const popup = useSelector((state) => state.modalOnOff);
  const popupModal = popup.popupModal;
  const popupMessage = popup.popupMessage;
  const popupKind = popup.popupKind;
  const popupCallback = popup.popupCallback;

  // console.log("popupModal111", popupModal);
  // console.log("popupModal222", popupModal);
  // console.log("popupModal333", popupMessage);

  return (
    <div className={styles.body}>
      <nav className={styles.nav}>
        <Header roomId={roomId} />
      </nav>
      <div className={styles.content}>{user !== null && <Outlet />}</div>
      {popupModal ? (
        <div className={styles.popup}>
          <PopUp
            popupModal={popupModal}
            popupMessage={popupMessage}
            popupKind={popupKind}
            popupCallback={popupCallback}
          />
        </div>
      ) : null}
    </div>
  );
}

export default App;
