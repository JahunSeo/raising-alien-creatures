import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useMatch } from "react-router-dom";
import { Button } from "react-bootstrap";
import Title from "./Title";

import SignUpModal from "../../modals/SignUpModal";
import SignInModal from "../../modals/SignInModal";
import * as actions from "../../Redux/actions";
import api from "../../apis/index";
import styles from "./index.module.css";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function Header(props) {
  // redux에서 user정보 받아오기
  const { user } = useSelector(({ user }) => ({ user: user.user }));

  // const roomId = useSelector(({room}) =>({ roomId : room.roomId.roomId }))
  const dispatch = useDispatch();
  // const [loginStatus, setLoginStatus] = useState(false);
  const [signUpModalOn, setSignUpModalOn] = useState(false);
  const [signInModalOn, setSignInModalOn] = useState(false);

  const postSignOut = async () => {
    const res = await api.get("/user/logout");
    dispatch(actions.logout());
    // setLoginStatus(false);
  };

  const handleLogout = (e) => {
    // TODO: Redux 처리 - setSignInClicked();
    postSignOut();
  };

  useEffect(() => {
    const getLoginStatus = async () => {
      // 1단계: 로그인 상태 확인
      let res = await api.get("/user/login/confirm");
      if (!res.data.login) return;
      let user = res.data;
      user.challenges = [];
      // 2단계: 유저 관련 정보 확인 (참여중 챌린지 등)
      res = await api.get("/user/personalinfo");
      if (res.data.result === "success") {
        user.challenges = res.data.Challenge;
      }
      // 리덕스에 저장
      dispatch(actions.checkUser(user));
    };
    getLoginStatus();
  }, [dispatch]);

  // console.log("[Header] user", user);

  return (
    <div className={styles.body}>
      <div className={styles.bodyInner}>
        <div className={cx("item", "itemTitle")}>
          <Title />
        </div>
        <div className={cx("item", "itemRoom")}>
          <Link to={"/"}>
            <button>{"메인화면"}</button>
          </Link>
          {user && user.nickname && (
            <Link to={`/user/${user.id}`}>
              <button>{"나의 어항"}</button>
            </Link>
          )}

          {user && user.nickname && (
            <Link to={`/approval`}>
              <button>{"승인"}</button>
            </Link>
          )}
        </div>
        {user ? (
          <div className={cx("item", "itemUser")}>
            <div className={styles.username}>{user && user.nickname}</div>
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
      </div>
      <SignUpModal
        show={signUpModalOn}
        onHide={() => setSignUpModalOn(false)}
      />
      <SignInModal
        show={signInModalOn}
        onHide={() => setSignInModalOn(false)}
        setSignInModalOn={setSignInModalOn}
      />
    </div>
  );
}
