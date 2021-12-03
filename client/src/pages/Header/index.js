import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Title from "./Title";
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
            <Link to={"/"} className={cx("btn")}>
              {"검색"}
            </Link>
            {user.login ? (
              <Link to={`/user/${user.id}/room`} className={cx("btn")}>
                {"My"}
              </Link>
            ) : (
              <p className={cx("btn")} onClick={() => switchSignInModal()}>
                {"My"}
              </p>
            )}
            {user.login ? (
              <Link to={`/approval`} className={cx("btn")}>
                {"승인"}
              </Link>
            ) : (
              <p className={cx("btn")} onClick={() => switchSignInModal()}>
                {"승인"}
              </p>
            )}
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

function ToggleBtn(props) {
  const { isMenuOn, setIsMenuOn } = props;
  return (
    <nav className={styles.toggleBtn}>
      <button
        className="text-gray-500 w-10 h-10 relative focus:outline-none bg-transparent"
        onClick={() => setIsMenuOn(!isMenuOn)}
      >
        <div className="block w-5 absolute left-1/2 top-1/2   transform  -translate-x-1/2 -translate-y-1/2">
          <span
            aria-hidden="true"
            className={cx(
              "block absolute h-0.5 w-5 bg-white transform transition duration-500 ease-in-out",
              isMenuOn ? "rotate-45" : "-translate-y-1.5"
            )}
          ></span>
          <span
            aria-hidden="true"
            className={cx(
              "block absolute h-0.5 w-5 bg-white transform transition duration-500 ease-in-out",
              isMenuOn ? "opacity-0" : ""
            )}
          ></span>
          <span
            aria-hidden="true"
            className={cx(
              "block absolute h-0.5 w-5 bg-white transform transition duration-500 ease-in-out",
              isMenuOn ? "-rotate-45" : "translate-y-1.5"
            )}
          ></span>
        </div>
      </button>
    </nav>
  );
}
