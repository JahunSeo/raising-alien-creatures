import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import styles from "./index.module.css";
import SignUpModal from "../../../modals/SignUpModal";
import SignInModal from "../../../modals/SignInModal";
import SideBarModal from "./Modal/SideBarModal.js";
import { useDispatch } from "react-redux";
import * as actions from "../../../Redux/actions/index.js";

import api from "../../../apis";

import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function Header(props) {
  const { rooms, roomId, setRoomId } = props;
  const dispatch = useDispatch();
  const [loginStatus, setLoginStatus] = useState(false);
  const [signUpModalOn, setSignUpModalOn] = useState(false);
  const [signInModalOn, setSignInModalOn] = useState(false);

  // 모달창
  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const [testUser, setTestUser] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    console.log(testUser);
    if (!!userInfo && !testUser) {
      // logout
      try {
        const fetchLogout = async () => {
          console.log(111);
          const res = await api.get("/user/logout");
          console.log("fetch test logout result", res.data);
        };
        fetchLogout();
      } catch (err) {
        console.error("fetch test user fail", err);
        // setTestUser(false);
      }
    }

    if (testUser) {
      // login
      console.log(222);
      try {
        const fetchUser = async () => {
          const user = { email: "kjy@kjy.net", pwd: 12345 };
          // console.log("fetch test user", user);
          const res = await api.post("/user/login", user);
          console.log("fetch test user result", res.data);
          setUserInfo(user.email);
        };
        fetchUser();
      } catch (err) {
        console.error("fetch test user fail", err);
        // setTestUser(false);
      }
    }
  }, [testUser]);

  return (
    <div className={styles.body}>
      <div className={cx("item", "itemTitle")}>
        <h1 className={styles.title}>{`Aquarium: ROOM ${roomId}`}</h1>
      </div>
      <div className={cx("item", "itemRoom")}>
        {rooms.map((roomId) => (
          <button
            key={roomId}
            onClick={() => setRoomId(roomId)}
          >{`Room ${roomId}`}</button>
        ))}
      </div>
      <div className={cx("item", "itemHistory")}>
        <button onClick={openModal}>나의 기록</button>
        <button onClick={() => setTestUser(true)}>테스트 로그인</button>
        <button onClick={() => setTestUser(false)}>테스트 로그아웃</button>
      </div>
      {loginStatus ? (
        <div className={cx("item", "itemUser")}>
          <Button
            variant="primary"
            // onClick={() => setSignUpModalOn(true)}
          >
            나의 기록
          </Button>
          <h1>&nbsp;</h1>
          <Button variant="info" onClick={() => setLoginStatus(false)}>
            로그아웃
          </Button>
        </div>
      ) : (
        <div className={cx("item", "itemUser")}>
          <Button variant="primary" onClick={() => setSignUpModalOn(true)}>
            회원가입
          </Button>
          <h1>&nbsp;</h1>
          <Button variant="info" onClick={() => setSignInModalOn(true)}>
            로그인
          </Button>
        </div>
      )}
      <SignUpModal
        show={signUpModalOn}
        onHide={() => setSignUpModalOn(false)}
      />
      <SignInModal
        show={signInModalOn}
        onHide={() => setSignInModalOn(false)}
        setLoginStatus={setLoginStatus}
        setSignInModalOn={setSignInModalOn}
      />
      <SideBarModal
        showModal={showModal}
        closeModal={closeModal}
      ></SideBarModal>
    </div>
  );
}
