import React from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
// import { GoogleLogin } from 'react-google-login';
import HorizonLine from '../components/HorizonLine.js'

const SignInModal = ({ show, onHide }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Container>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        로그인
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>이메일</Form.Label>
                            <Form.Control type="email" placeholder="helloalien@jungle.com" />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>패스워드</Form.Label>
                            <Form.Control type="password" placeholder="********" />
                        </Form.Group>

                        <Button
                            className="my-3"
                            type="button"
                            variant="success"
                            style={{
                                width: "100%"
                            }}
                        >
                            로그인
                        </Button>
                        <HorizonLine text={"OR"} />
                        {/* <GoogleLogin
                            render={(renderProps) => {
                                return (
                                    <Button
                                        onClick={renderProps.onClick}
                                        disabled={renderProps.disabled}
                                        style={{
                                            backgroundColor: "#176BEF",
                                            borderColor: "#176BEF",
                                            width: "100%"
                                        }}
                                        block
                                    >
                                        <i className="fab fa-google"></i>&nbsp; 구글 계정으로 로그인
                                    </Button>
                                );
                            }}
                        /> */}
                    </Form>
                </Modal.Body>
            </Container>
        </Modal>
    );
};

export default SignInModal;