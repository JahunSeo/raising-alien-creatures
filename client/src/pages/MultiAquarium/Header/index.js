import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import styles from "./index.module.css";
import SignUpModal from "../../../modals/SignUpModal";
import SignInModal from "../../../modals/SignInModal";
import SideBarModal from "./Modal/SideBarModal.js";
import * as actions from "../../../Redux/actions";
import api from "../../../apis/index";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function Header(props) {
  const {user} = useSelector(({user}) => ({user: user.user}));
  console.log('user:', user);

  const { rooms, roomId, setRoomId } = props;
  const [loginStatus, setLoginStatus] = useState(false);
  const [signUpModalOn, setSignUpModalOn] = useState(false);
  const [signInModalOn, setSignInModalOn] = useState(false);

  const dispatch = useDispatch();

  const postSignOut = async () => {
    const res = await api.get("/user/logout");
    console.log("res", res);
    dispatch(actions.logout());
    setLoginStatus(false);
  };

  const handleLogout = (e) => {
    // setSignInClicked();
    postSignOut();
  };

  useEffect(() => {
    const getLoginStatus = async () => {
      const res = await api.get("/user/login/confirm");
      console.log("res", res);
      if (res.data.login){
        setLoginStatus(true);
        dispatch(actions.checkUser(res))
      }
    };

    getLoginStatus();
  }, [dispatch]);

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
        <button onClick={() => dispatch(actions.showModal(true))}>
          나의 기록
        </button>
      </div>
      {loginStatus ? (
        <div className={cx("item", "itemUser")}>
          <Button variant="primary">{user && user.data.nickname}</Button>
          <h1>&nbsp;</h1>
          <Button variant="info" onClick={handleLogout}>
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
      <SideBarModal />
    </div>
  );
}
