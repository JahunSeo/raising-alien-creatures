import React, { useState } from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import styles from './index.module.css';
import SignUpModal from '../../../modals/SignUpModal';
import SignInModal from '../../../modals/SignInModal';

import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function Header(props) {
  const { rooms, roomId, setRoomId } = props;
  const [signUpModalOn, setSignUpModalOn] = useState(false);
  const [signInModalOn, setSignInModalOn] = useState(false);

  return (
    <>
      <SignUpModal
        show={signUpModalOn}
        onHide={() => setSignUpModalOn(false)}
      />
      <SignInModal
        show={signInModalOn}
        onHide={() => setSignInModalOn(false)}
      />
      <div className={styles.body}>
        <div className={cx("item", "itemTitle")}>
          <h1 className={styles.title}>
            {`Aquarium: ROOM ${roomId}`}
          </h1>
        </div>
        <div className={cx("item", "itemRoom")}>
          {rooms.map((roomId) => (
            <button
              key={roomId}
              onClick={() => setRoomId(roomId)}
            >{`Room ${roomId}`}</button>
          ))}
        </div>
        <div className={cx("item", "itemUser")}>
          <Button
            variant="primary"
            onClick={() => setSignUpModalOn(true)}
          >
            회원가입
          </Button>
          <h1>&nbsp;</h1>
          <Button
            variant="info"
            onClick={() => setSignInModalOn(true)}
          >
            로그인
          </Button>
        </div>
      </div>
    </>
  );
}
