import React, { useRef } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import Header from "./pages/Header";
import Approval from "./pages/Approval";
import NewAlien from "./pages/NewAlien";

import MultiAquarium from "./pages/MultiAquarium";

import PlazaRoom from "./pages/MultiAquarium/Room/PlazaRoom";
import UserRoom from "./pages/MultiAquarium/Room/UserRoom";
import ChallengeRoom from "./pages/MultiAquarium/Room/ChallengeRoom";

import styles from "./App.module.css";

function App() {
  const rooms = useRef();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="approval" element={<Approval />} />
          <Route path="alien/:challengeId/:userId" element={<NewAlien />} />
          <Route path="/" element={<MultiAquarium rooms={rooms} />}>
            <Route path="" element={<PlazaRoom rooms={rooms} />} />
            <Route path="user/:userId" element={<UserRoom rooms={rooms} />} />
            <Route
              path="challenge/:challengeId"
              element={<ChallengeRoom rooms={rooms} />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout() {
  const { roomId } = useSelector(({ room }) => ({
    roomId: room.roomId,
  }));
  return (
    <div className={styles.body}>
      <nav className={styles.nav}>
        <Header roomId={roomId} />
      </nav>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
