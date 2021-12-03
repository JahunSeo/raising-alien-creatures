import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import SocketContainer from "./pages/SocketContainer";
import Header from "./pages/Header";
import Approval from "./pages/Approval";
import NewChallenge from "./pages/NewChallenge";
import NewAlien from "./pages/NewAlien";

import MultiAquarium from "./pages/MultiAquarium";
import PlazaRoom from "./pages/MultiAquarium/Room/PlazaRoom";
import UserRoom from "./pages/MultiAquarium/Room/UserRoom";
import ChallengeRoom from "./pages/MultiAquarium/Room/ChallengeRoom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./custom-toastify.css";

import PopUp from "./pages/PopUp";
import styles from "./App.module.css";

function App() {
  console.log(123);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="approval" element={<Approval />} />
          <Route path="challenge/new" element={<NewChallenge />} />
          <Route path="challenge/:challengeId/join" element={<NewAlien />} />
          <Route path="/" element={<MultiAquarium />}>
            <Route path="" element={<PlazaRoom />} />
            <Route path="user/:userId/room" element={<UserRoom />} />
            <Route
              path="challenge/:challengeId/room"
              element={<ChallengeRoom />}
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
  const popup = useSelector((state) => state.modalOnOff);
  const popupModal = popup.popupModal;
  const popupMessage = popup.popupMessage;
  const popupKind = popup.popupKind;
  const popupCallback = popup.popupCallback;

  return (
    <div className={styles.body}>
      <nav className={styles.nav}>
        <Header roomId={roomId} />
      </nav>
      {user !== null && <SocketContainer />}
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
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="ToastContainer"
        toastClassName="Toast"
        bodyClassName="Toast__body"
        progressClassName="Toast__progress"
      />
    </div>
  );
}

export default App;
