import React, { useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import SignUpModal from "../modals/SignUpModal";
import SignInModal from "../modals/SignInModal";

const Header = () => {
  const [loginStatus, setLoginStatus] = useState(false);
  const [signUpModalOn, setSignUpModalOn] = useState(false);
  const [signInModalOn, setSignInModalOn] = useState(false);

  return (
    <div>
      <SignUpModal
        show={signUpModalOn}
        onHide={() => setSignUpModalOn(false)}
        setSignUpModalOn={setSignUpModalOn}
      />
      <SignInModal
        show={signInModalOn}
        onHide={() => setSignInModalOn(false)}
        setSignInModalOn={setSignInModalOn}
      />

      {loginStatus ? (
        <header>
          <Navbar bg="light" expand="lg">
            <Container>
              <Navbar.Brand>목표달성! 외계생물 기르기</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                  <Nav.Link>
                    <Button
                      variant="secondary"
                      onClick={() => setSignUpModalOn(true)}
                    >
                      회원정보
                    </Button>
                  </Nav.Link>
                  <Nav.Link>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setLoginStatus(false);
                        // 로그인 페이지 초기화 함수 추가
                      }}
                    >
                      로그아웃
                    </Button>
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
      ) : (
        <header>
          <Navbar bg="light" expand="lg">
            <Container>
              <Navbar.Brand>목표달성! 외계생물 기르기</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                  <Nav.Link>
                    <Button
                      variant="secondary"
                      onClick={() => setSignUpModalOn(true)}
                    >
                      회원가입
                    </Button>
                  </Nav.Link>
                  <Nav.Link>
                    <Button
                      variant="primary"
                      onClick={() => setSignInModalOn(true)}
                    >
                      로그인
                    </Button>
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
      )}
    </div>
  );
};

export default Header;
