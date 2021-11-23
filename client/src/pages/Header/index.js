import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Title from "./Title";
import SignUpModal from "../../modals/SignUpModal";
import SignInModal from "../../modals/SignInModal";
import * as actions from "../../Redux/actions";
import api from "../../apis/index";
import styles from "./index.module.css";
import "./UserBtn.css";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function Header(props) {
  // redux에서 user정보 받아오기
  const { user } = useSelector(({ user }) => ({ user: user.user }));
  // const roomId = useSelector(({room}) =>({ roomId : room.roomId.roomId }))
  const dispatch = useDispatch();
  // const [loginStatus, setLoginStatus] = useState(false);
  const showSignUpModal = useSelector(
    (state) => state.modalOnOff.showSignUpModal
  );
  const showSignInModal = useSelector(
    (state) => state.modalOnOff.showSignInModal
  );

  const navigate = useNavigate();

  const postSignOut = async () => {
    const res = await api.get("/user/logout");
    dispatch(actions.logout());
  };

  const handleLogout = (e) => {
    postSignOut();
    navigate("/");
  };

  function switchSignUpModal() {
    if (showSignInModal) {
      dispatch(actions.showSignInModal(false));
      dispatch(actions.showSignUpModal(true));
    } else {
      dispatch(actions.showSignUpModal(true));
    }

    if (showSignUpModal) {
      dispatch(actions.showSignUpModal(false));
    }
  }

  function switchSignInModal() {
    if (showSignUpModal) {
      dispatch(actions.showSignUpModal(false));
      dispatch(actions.showSignInModal(true));
    } else {
      dispatch(actions.showSignInModal(true));
    }

    if (showSignInModal) {
      dispatch(actions.showSignInModal(false));
    }
  }

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

  return (
    <div className={styles.body}>
      <div className={styles.bodyInner}>
        <div className={cx("item", "itemTitle")}>
          <Title />
        </div>
        <div className={cx("item", "itemRoom")}>
          <Link to={"/"}>
            <button className={cx("btn")}>{"챌린지 검색"}</button>
          </Link>
          {user && user.nickname && (
            <Link to={`/user/${user.id}/room`}>
              <button className={cx("btn")}>{"나의 어항"}</button>
            </Link>
          )}
          {user && user.nickname && (
            <Link to={`/approval`}>
              <button className={cx("btn")}>{"승인하기"}</button>
            </Link>
          )}
        </div>
        {user ? (
          <div className={cx("item", "itemUser")}>
            <div className={styles.username}>{user && user.nickname}</div>
            <button
              type="button"
              className="UserBtn UserBtn--logout"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className={cx("item", "itemUser")}>
            <button
              type="button"
              className="UserBtn UserBtn--register"
              onClick={() => switchSignUpModal()}
            >
              회원가입
            </button>
            <button
              type="button"
              className="UserBtn UserBtn--login"
              onClick={() => switchSignInModal()}
            >
              로그인
            </button>
          </div>
        )}
      </div>
      <SignUpModal />
      <SignInModal />
    </div>
  );
}
