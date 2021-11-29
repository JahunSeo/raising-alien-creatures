import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as socket from "../../apis/socket";

export default function SocketContainer(props) {
  const { user } = useSelector(({ user }) => ({ user: user.user }));
  // const dispatch = useDispatch()

  // user 정보 중 login, challenges에 변동이 생겼을 때,
  // 기존 socket을 disconnect하고 새로 생성
  // (지금은 다른 정보가 바뀔 일이 없으니 user로 통일)
  useEffect(() => {
    // 1단계: 로그인 상태면 새로 연결
    if (user.login) {
      console.log("[socket container] step1. login");
      socket.init(user);
    }

    // 2단계: 기존 연결된 것이 있으면 연결을 끊는다.
    // (상태가 변경되거나 새로고침할 때, 창을 닫을 때)
    return () => {
      console.log("[socket container] step2. disconnect");
      socket.disconnect();
    };
  }, [user]);

  return <React.Fragment />;
}
