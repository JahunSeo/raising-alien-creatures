import React, { useState, useEffect } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import styles from "./SignInModal.module.css";
import api from "../apis/index.js";

const SignInModal = ({ show, onHide, setSignInModalOn, setLoginStatus }) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [signInClicked, setSignInClicked] = useState(false);
  const [signInError, setSignInError] = useState(null);
  const [signInMessage, setSignInMessage] = useState(null);

  const [signInStatus, setSignInStatus] = useState(false);

  function validateSignIn(userEmail, userPassword) {
    if (
      (userEmail !== "") &
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail)
    ) {
      setSignInMessage("입력하신 이메일 주소가 유효하지 않습니다.");
      return false;
    }

    // if (userPassword !== "") {
    //   setSignInMessage("입력하신 이메일과 패스워드가 일치하지 않습니다.");
    //   return false;
    // }

    if (userEmail === "" || userPassword === "") {
      setSignInMessage("입력하지 않은 회원정보가 있습니다.");
      return false;
    }

    // setSignInStatus(true);
    // console.log("signInStatus", signInStatus);

    setSignInMessage(null);
    return true;
  }

  const postSignIn = async () => {
    let signInData = { email: userEmail, pwd: userPassword };
    const response = await api.post("/user/login", signInData);
    console.log("response", response);
    // const data = await response.json();
    // console.log("data", data);
    if (response.data.result === "success") {
      signInSuccess();
    } else {
      signInFailure();
    }
  };

  console.log("signInClicked", signInClicked);

  useEffect(() => {
    try {
      setSignInError(null);
      postSignIn();
      // 회원정보 DB에서 관리하는 데이터가 signInData와 일치하면 signInSuccess() 그렇지 않으면 signInFailure() 실행
      // ex) {signInResponse == "success" ? signInSuccess() : signInFailure()}
    } catch (err) {
      setSignInError(err);
      console.log("SIGN-IN ERROR", signInError);
    }
  }, [signInClicked]);

  function signInSuccess() {
    return () => {
      setSignInClicked(false);
      setSignInStatus(true);
      setLoginStatus(true);
      console.log("signInStatus", signInStatus);
      setSignInModalOn(false);
    };
  }

  function signInFailure() {
    return () => {
      setSignInClicked(false);
    };
  }

  const onClick = (event) => {
    event.preventDefault();
    setSignInMessage(null);
    if (validateSignIn(userEmail, userPassword) === true) {
      setSignInClicked(true);
    }
  };

  return (
    <Modal
      className={styles.modal__form}
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Container className={styles.container}>
        <Modal.Header
          closeButton
          onClick={() => {
            setUserEmail("");
            setUserPassword("");
            setSignInMessage(null);
          }}
        >
          <Modal.Title id="contained-modal-title-vcenter">로그인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className={styles.form__signin}>
            <Form.Group>
              <Form.Label>이메일</Form.Label>
              <Form.Control
                className={styles.form__input}
                type="email"
                placeholder="helloalien@jungle.com"
                onChange={(e) => {
                  setUserEmail(e.target.value);
                }}
              />
              <br />
            </Form.Group>

            <Form.Group>
              <Form.Label>패스워드</Form.Label>
              <Form.Control
                type="password"
                placeholder="********"
                onChange={(e) => {
                  setUserPassword(e.target.value);
                }}
              />
              <br />
            </Form.Group>

            <Form.Group className={styles.form__signin__message}>
              {signInMessage}
              <br />
            </Form.Group>

            <Button
              className="my-3"
              type="button"
              variant="success"
              style={{
                width: "100%",
              }}
              onClick={onClick}
            >
              로그인
            </Button>
          </Form>
        </Modal.Body>
      </Container>
    </Modal>
  );
};

export default SignInModal;
