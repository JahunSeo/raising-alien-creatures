import React, { useState, useEffect } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import styles from "./SignUpModal.module.css";
import api from "../apis/index.js";

const SignUpModal = ({ show, onHide, setSignUpModalOn, setLoginStatus }) => {
  const [userNickname, setUserNickname] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfirm, setUserConfirm] = useState("");

  const [signUpClicked, setSignUpClicked] = useState(false);
  const [signUpError, setSignUpError] = useState(null);
  const [signUpMessage, setSignUpMessage] = useState(null);

  function validateSignUp(userNickname, userEmail, userPassword, userConfirm) {
    if (
      (userEmail !== "") &
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail)
    ) {
      setSignUpMessage("입력하신 이메일 주소가 유효하지 않습니다.");
      return false;
    }

    if (userPassword !== userConfirm) {
      setSignUpMessage("입력하신 패스워드가 일치하지 않습니다.");
      return false;
    }

    if (
      userNickname === "" ||
      userEmail === "" ||
      userPassword === "" ||
      userConfirm === ""
    ) {
      setSignUpMessage("입력하지 않은 회원정보가 있습니다.");
      return false;
    }

    setSignUpMessage(null);
    return true;
  }

  const postSignUp = async () => {
    let signUpData = { userNickname, userEmail, userPassword, userConfirm };
    const response = await api.post("/login_process", signUpData);
    console.log("response", response);
    // const data = await response.json();
    // console.log("data", data);
  };

  console.log("signUpClicked", signUpClicked);

  useEffect(() => {
    try {
      setSignUpError(null);
      postSignUp();
    } catch (err) {
      setSignUpError(err);
      console.log("SIGN-UP ERROR", signUpError);
    }
  }, [signUpClicked]);

  function signUpSuccess() {
    return () => {
      setSignUpClicked(false);
      setSignUpModalOn(false);
    };
  }

  function signUpFailure() {
    return () => {
      setSignUpClicked(false);
    };
  }

  const onClick = (event) => {
    event.preventDefault();
    setSignUpMessage(null);
    if (
      validateSignUp(userNickname, userEmail, userPassword, userConfirm) ===
      true
    ) {
      setSignUpClicked(true);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Container>
        <Modal.Header
          closeButton
          onClick={() => {
            setUserNickname("");
            setUserEmail("");
            setUserPassword("");
            setUserConfirm("");
            setSignUpMessage(null);
          }}
        >
          <Modal.Title id="contained-modal-title-vcenter">회원가입</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>닉네임</Form.Label>
              <Form.Control
                type="text"
                placeholder="이재열"
                onChange={(e) => {
                  setUserNickname(e.target.value);
                }}
              />
              <br />
            </Form.Group>

            <Form.Group>
              <Form.Label>이메일</Form.Label>
              <Form.Control
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

            <Form.Group>
              <Form.Label>패스워드 확인</Form.Label>
              <Form.Control
                type="password"
                placeholder="********"
                onChange={(e) => {
                  setUserConfirm(e.target.value);
                }}
              />
              <br />
            </Form.Group>

            <Form.Group className={styles.form__signup__message}>
              {signUpMessage}
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
              회원가입
            </Button>
          </Form>
        </Modal.Body>
      </Container>
    </Modal>
  );
};

export default SignUpModal;
