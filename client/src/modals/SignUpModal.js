import React from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
// import { GoogleLogin } from 'react-google-login';
// import Axios from 'axios';
// import HorizonLine from '../components/HorizonLine.js'

const SignUpModal = ({ show, onHide, test }) => {
  // const [showSignUp, setShowSignUp] = useState(true);

  // const [userName, setUserName] = userState("");
  // const [userEmail, setUserEmail] = userState("");
  // const [userPassword, setUserPassword] = userState("");
  // const [userConfirm, setUserConfirm] = userState("");

  // const signup = () => {
  //     Axios.post("http://localhost:3000/signup", {
  //         username: userName,
  //         password: password,
  //     }).then(response) => {
  //         console.log(response);
  //     });
  // };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Container>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">회원가입</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>이름</Form.Label>
              <Form.Control
                type="text"
                placeholder="이재열"
                // onChange={(e) => {
                //     setUserName(e.target.value);
                // }}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>이메일</Form.Label>
              <Form.Control
                type="email"
                placeholder="helloalien@jungle.com"
                // onChange={(e) => {
                //     setUserEmail(e.target.value);
                // }}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>패스워드</Form.Label>
              <Form.Control
                type="password"
                placeholder="********"
                // onChange={(e) => {
                //     setUserPassword(e.target.value);
                // }}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>패스워드 확인</Form.Label>
              <Form.Control
                type="password"
                placeholder="********"
                // onChange={(e) => {
                //     setUserConfirm(e.target.value);
                // }}
              />
            </Form.Group>
            <Button
              className="my-3"
              type="button"
              variant="success"
              style={{
                width: "100%",
              }}
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
