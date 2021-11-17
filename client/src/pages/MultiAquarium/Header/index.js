import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import styles from "./index.module.css";
import SignUpModal from "../../../modals/SignUpModal";
import SignInModal from "../../../modals/SignInModal";
import ChallengeModal from "./Modal/ChallengeModal";
import * as actions from "../../../Redux/actions";
import api from "../../../apis/index";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function Header(props) {
  const { rooms, roomId, setRoomId } = props;
  const [loginStatus, setLoginStatus] = useState(false);
  const [signUpModalOn, setSignUpModalOn] = useState(false);
  const [signInModalOn, setSignInModalOn] = useState(false);
  const [challengeModalOn, setChallengeModalOn] = useState(false);

  const dispatch = useDispatch();
  const showModal1 = useSelector((state) => state.modalOnOff.showModal1);

  const postSignOut = async () => {
    const res = await api.get("/user/logout");
    console.log("res", res);
    setLoginStatus(false);
    alert("성공적으로 로그아웃하였습니다.");
  };

  const handleLogout = (e) => {
    // TODO: Redux 처리 - setSignInClicked();
    postSignOut();
  };

  const handleClick = (current) => {
    // dispatch(actions.showModal((current) => !current));
  };

  useEffect(() => {
    const getLoginStatus = async () => {
      const res = await api.get("/user/login/confirm");
      console.log("res", res);
      if (res.data.login) {
        setLoginStatus(true);
      }
    };

    getLoginStatus();
  }, []);

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
        <button
        // onClick={(current) =>
        //   dispatch(actions.showModal((current) => !current))
        // }
        >
          나의 기록
        </button>
      </div>
      {loginStatus ? (
        <div className={cx("item", "itemUser")}>
          <Button
            variant="danger"
            onClick={() => dispatch(actions.showModal(!showModal1))}
          >
            새로운 챌린지 생성
          </Button>
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
      <ChallengeModal
        show={challengeModalOn}
        onHide={() => setChallengeModalOn(false)}
      />
    </div>
  );
}
