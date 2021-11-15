import React, { useState, useEffect } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import HorizonLine from "../components/HorizonLine";
import * as api from "../apis/index.js";

const SignInModal = ({ show, onHide, setSignInModalOn, setLoginStatus }) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  console.log("userEmail", userEmail);
  console.log("userPassword", userPassword);

  const postUserInfo = async () => {
    let userData = { email: userEmail, pwd: userPassword };
    const response = await api.login("/user/login_process", userData);
    console.log("response", response);
    const data = await response.json();
    console.log("data", data);
  };

  //   data가 userData와 일치하면 loginSuccess() 그렇지 않으면 loginFailure 실행

  function loginSuccess() {
    return () => {
      setLoginStatus(true);
      setSignInModalOn(false);
    };
  }

  function loginFailure() {
    return () => {
      // 로그인 실패 alert 창 또는 에러 메세지 띄우기
    };
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Container>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">로그인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>이메일</Form.Label>
              <Form.Control
                type="email"
                placeholder="helloalien@jungle.com"
                onChange={(e) => {
                  setUserEmail(e.target.value);
                }}
              />
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
            </Form.Group>

            <Button
              className="my-3"
              type="button"
              variant="success"
              style={{
                width: "100%",
              }}
              onClick={() => {
                // setLoginStatus(true);
                // setSignInModalOn(false);
                postUserInfo();
              }}
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
