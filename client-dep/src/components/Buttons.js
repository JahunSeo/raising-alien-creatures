import React, { useState } from 'react';
import styles from '../pages/MultiAquarium/index.module.css';
import { Button } from 'react-bootstrap';
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function Buttons() {
    const [loginStatus, setLoginStatus] = useState(false);

    return (
        <div className={cx("item", "itemUser")}>
            {loginStatus ? <div>
                <Button
                    variant="primary"
                // onClick={() => setSignUpModalOn(true)}
                >
                    나의 기록
                </Button>
                <h1>&nbsp;</h1>
                <Button
                    variant="info"
                // onClick={() => setSignInModalOn(true)}
                >
                    로그아웃
                </Button>
            </div> : <div>
                <Button
                    variant="primary"
                    // onClick={() => setSignUpModalOn(true)}
                >
                    회원가입
                </Button>
                <h1>&nbsp;</h1>
                <Button
                    variant="info"
                    // onClick={() => setSignInModalOn(true)}
                >
                    로그인
                </Button>
            </div>};
        </div>
    );
};

export default Buttons;