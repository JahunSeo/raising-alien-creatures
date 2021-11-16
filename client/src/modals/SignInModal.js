import React, { useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import styles from "./SignInModal.module.css";
import api from "../apis/index.js";

const SignInModal = ({ show, onHide, setSignInModalOn, setLoginStatus }) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const [signInClicked, setSignInClicked] = useState(false);
  const [signInMessage, setSignInMessage] = useState(null);

  function validateSignIn(userEmail, userPassword) {
    if (
      (userEmail !== "") &
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail)
    ) {
      setSignInMessage("이메일 주소가 유효하지 않습니다.");
      return false;
    }

    if (userEmail === "" || userPassword === "") {
      setSignInMessage("입력하지 않은 회원정보가 있습니다.");
      return false;
    }

    setSignInMessage(null);
    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (signInClicked) return;
    if (!validateSignIn(userEmail, userPassword)) return;
    setSignInMessage(null);
    setSignInClicked(true);
    postSignIn();
  };

  const postSignIn = async () => {
    let signInData = { email: userEmail, pwd: userPassword };
    const res = await api.post("/user/login", signInData);
    console.log("res", res);
    if (res.data.result === "success") {
      // TODO: Redux 처리
      setLoginStatus(true);
      setSignInModalOn(false);
    } else {
      setSignInMessage("이메일과 패스워드가 일치하지 않습니다.");
      setSignInClicked(false);
    }
  };

  return (
    <Modal
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
          <Form>
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
              onClick={handleSubmit}
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
