import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./SignUpModal.css";
import styles from "./SignUpModal.module.css";
import api from "../apis/index.js";
import * as actions from "../Redux/actions";

const SignUpModal = ({}) => {
  const dispatch = useDispatch();
  const showSignUpModal = useSelector(
    (state) => state.modalOnOff.showSignUpModal
  );

  const [userNickname, setUserNickname] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfirm, setUserConfirm] = useState("");
  const [signUpMessage, setSignUpMessage] = useState(null);

  const postSignUp = async () => {
    let signUpData = { userNickname, userEmail, userPassword, userConfirm };
    const res = await api.post("/user/register", signUpData);
    console.log("res", res);
    if (res.data.result === "success") {
      alert("회원가입에 성공하였습니다.");
      setUserNickname("");
      setUserEmail("");
      setUserPassword("");
      setUserConfirm("");
      setSignUpMessage(null);
      dispatch(actions.showSignUpModal(!showSignUpModal));
    } else {
      if (res.data.result === "fail") {
        setSignUpMessage("이미 존재하는 이메일 주소입니다.");
      } else {
        setSignUpMessage("이미 존재하는 닉네임입니다.");
      }
    }
  };

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
    postSignUp();
  };

  return (
    <div className={showSignUpModal ? "SignUpContainer" : "hidden"}>
      <div class="flex flex-col max-w-md px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
        <div class="self-center mb-2 text-xl font-light text-gray-800 sm:text-2xl dark:text-white">
          신나는 회원가입
        </div>
        <div class="p-6 mt-8">
          <form action="#">
            <div class="flex flex-col mb-2">
              <div class="relative">
                <input
                  type="text"
                  class="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  value={userNickname}
                  placeholder="이재열"
                  onChange={(e) => {
                    setUserNickname(e.target.value);
                  }}
                />
              </div>
            </div>
            <div class="flex flex-col mb-2">
              <div class="relative">
                <input
                  type="text"
                  class="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  value={userEmail}
                  placeholder="santoryu1118@gmail.com"
                  onChange={(e) => {
                    setUserEmail(e.target.value);
                  }}
                />
              </div>
            </div>
            <div class="flex flex-col mb-2">
              <div class="relative">
                <input
                  type="password"
                  class="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  value={userPassword}
                  placeholder="********"
                  onChange={(e) => {
                    setUserPassword(e.target.value);
                  }}
                />
              </div>
            </div>
            <div class="flex flex-col mb-2">
              <div class="relative">
                <input
                  type="password"
                  class="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  value={userConfirm}
                  placeholder="********"
                  onChange={(e) => {
                    setUserConfirm(e.target.value);
                  }}
                />
              </div>
            </div>
            <div class="text-red-600">
              <br />
              {signUpMessage}
              <br />
            </div>
            <div class="flex w-full my-4">
              <button
                type="submit"
                class="py-2 px-4  bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                onClick={handleSubmit}
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;
