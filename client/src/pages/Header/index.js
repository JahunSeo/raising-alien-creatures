import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Title from "./Title";

import ToggleBtn from "./Buttons/ToggleBtn";
import SearchBtn from "./Buttons/SearchBtn";
import ApproveBtn from "./Buttons/ApproveBtn";

import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import AuthRequestModal from "./AuthRequestModal";
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
  const { showSignUpModal, showSignInModal } = useSelector(
    ({ modalOnOff }) => ({
      showSignUpModal: modalOnOff.showSignUpModal,
      showSignInModal: modalOnOff.showSignInModal,
    })
  );
  function switchSignUpModal() {
    dispatch(actions.showSignInModal(false));
    dispatch(actions.showSignUpModal(!showSignUpModal));
  }

  function switchSignInModal() {
    dispatch(actions.showSignUpModal(false));
    dispatch(actions.showSignInModal(!showSignInModal));
  }

  const navigate = useNavigate();
  const handleLogout = async () => {
    await api.get("/user/logout");
    dispatch(actions.logout());
    navigate("/");
  };

  // menu toggle
  const [isMenuOn, setIsMenuOn] = useState(false);

  useEffect(() => {
    const getLoginStatus = async () => {
      // 1단계: 로그인 상태 확인
      let res = await api.get("/user/login/confirm");
      let user = res.data;
      if (!res.data.login) {
        dispatch(actions.checkUser(user)); // {login: false}
        return;
      }
      user.challenges = [];
      // 2단계: 유저 관련 정보 확인 (참여중 챌린지 등)
      res = await api.get("/user/challenges/ids");
      if (res.data.result === "success") {
        user.challenges = res.data.challenges;
      }
      // 리덕스에 저장
      dispatch(actions.checkUser(user));
    };
    getLoginStatus();
  }, [dispatch]);

  // login 여부 확인 완료된 시점에 접근하도록 구분
  if (user === null) {
    return <div>로딩중...</div>;
  }

  return (
    <div className={styles.body}>
      <div className={styles.bodyInner}>
        <ToggleBtn isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
        <div className={cx("block", "block--title")}>
          <Title />
        </div>
        <div
          className={cx(
            "block",
            "block--btn",
            isMenuOn ? "block--on" : "block--off"
          )}
        >
          <div className={cx("btnRow", "btnRow--basic")}>
            <SearchBtn />
            {user.login ? (
              <Link to={`/user/${user.id}/room`} className={cx("MenuBtn")}>
                {"My"}
              </Link>
            ) : (
              <p className={cx("MenuBtn")} onClick={() => switchSignInModal()}>
                {"My"}
              </p>
            )}
            <ApproveBtn user={user} switchSignInModal={switchSignInModal} />
          </div>
          <div className={cx("btnRow", "btnRow--user")}>
            {user.login ? (
              <React.Fragment>
                <div className={styles.username}>{user.nickname}</div>
                <button
                  type="button"
                  className={cx("UserBtn", "UserBtn--logout")}
                  onClick={() => handleLogout()}
                >
                  로그아웃
                </button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <button
                  type="button"
                  className={cx("UserBtn", "UserBtn--register")}
                  onClick={() => switchSignUpModal()}
                >
                  회원가입
                </button>
                <button
                  type="button"
                  className={cx("UserBtn", "UserBtn--login")}
                  onClick={() => switchSignInModal()}
                >
                  로그인
                </button>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
      <SignUpModal />
      <SignInModal />
      <AuthRequestModal />
    </div>
  );
}
