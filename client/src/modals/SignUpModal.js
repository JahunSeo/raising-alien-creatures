import React, { useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import styles from "./SignUpModal.module.css";
import api from "../apis/index.js";

const SignUpModal = ({ show, onHide, setSignUpModalOn, setLoginStatus }) => {
  const [userNickname, setUserNickname] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfirm, setUserConfirm] = useState("");

  const [signUpClicked, setSignUpClicked] = useState(false);
  const [signUpMessage, setSignUpMessage] = useState(null);

  function validateSignUp(userNickname, userEmail, userPassword, userConfirm) {
    if (
      (userEmail !== "") &
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail)
    ) {
      setSignUpMessage("이메일 주소가 유효하지 않습니다.");
      return false;
    }

    if (userNickname.length > 20) {
      setSignUpMessage("닉네임은 최대 20글자 이하여야 합니다.");
      return false;
    }

    if (userPassword !== userConfirm) {
      setSignUpMessage("패스워드가 일치하지 않습니다.");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSignUpMessage(null);
    if (!validateSignUp(userNickname, userEmail, userPassword, userConfirm))
      return;
    setSignUpMessage(null);
    setSignUpClicked(true);
    postSignUp();
  };

  const postSignUp = async () => {
    let signUpData = { userNickname, userEmail, userPassword, userConfirm };
    const res = await api.post("/user/register", signUpData);
    console.log("res", res);
    if (res.data.result === "success") {
      // TODO: Redux 처리
      alert("회원가입에 성공하였습니다.");
      setSignUpClicked(false);
      // setSignUpModalOn(false);
    } else {
      if (res.data.msg === "DB Insert Fail.") {
        setSignUpMessage("이미 존재하는 이메일입니다.");
        setSignUpClicked(false);
      } else {
        setSignUpMessage("이미 존재하는 닉네임입니다.");
        setSignUpClicked(false);
      }
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
              onClick={handleSubmit}
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
