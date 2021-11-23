import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import api from "../../apis/index.js";
import * as actions from "../../Redux/actions";

export default function Approval(props) {
  // TODO: login 상태일 때만 접근할 수 있음
  const { user } = useSelector(({ user }) => ({ user: user.user }));

  const [authRequests, setAuthRequests] = useState([]);

  useEffect(() => {
    const loadAuthRequests = async () => {
      const res = await api.get("/user/approval/list");
      if (!res.data.data.length) {
        console.log("res", res);
        console.log("현재 수락을 기다리는 인증 요청이 없습니다.");
      } else {
        console.log("res", res);
        setAuthRequests(res.data.data);
        return;
      }
    };
    loadAuthRequests();
  }, []);

  console.log("authRequests", authRequests);

  return (
    <div className="authRequests">
      {authRequests.map((authRequest) => (
        <AuthRequest key={authRequest.id} authRequest={authRequest} />
      ))}
    </div>
  );
}

const AuthRequest = ({ authRequest }) => {
  const navigate = useNavigate();

  const authYear = authRequest.request_date.slice(0, 4);
  const authMonth = authRequest.request_date.slice(5, 7);
  const authDate = authRequest.request_date.slice(8, 10);
  const authHour = authRequest.request_date.slice(11, 13);
  const authMinute = authRequest.request_date.slice(14, 16);

  const [approvalStatus, SetApprovalStatus] = useState(false);

  const postApproval = async () => {
    const req = await api.post("/challenge/approve", {
      auth_id: authRequest.authentification_id,
      Alien_id: authRequest.alien_id,
    });
    console.log("req", req);
  };

  const handleSubmit = () => {
    postApproval();
    alert(
      `${authRequest.request_user_nickname} 님의 인증을 흔쾌히 수락하였습니다.`
    );
    SetApprovalStatus(true);
  };

  const handleNavigate = () => {
    navigate(`/user/${authRequest.request_user_id}/room`);
  };

  const ApprovalButton = () => {
    if (!approvalStatus & !authRequest.isAuth) {
      return (
        <button
          type="button"
          class="flex max-w-sm w-full bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 focus:outline-none text-white text-2xl uppercase font-bold shadow-md rounded-lg mx-auto p-5"
          onClick={handleSubmit}
        >
          <div class="flex sm:flex-cols-12 gap-4">
            <div class="col-span-1">
              <svg
                class="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
                />
              </svg>
            </div>
            <div class="col-span-2 pt-1.5">인증 수락</div>
          </div>
        </button>
      );
    } else {
      return (
        <button
          type="button"
          class="flex max-w-sm w-full bg-gradient-to-r from-indigo-600 via-pink-600 to-red-600 hover:from-indigo-500 hover:via-pink-500 hover:to-yellow-500 focus:outline-none text-white text-2xl uppercase font-bold shadow-md rounded-lg mx-auto p-5"
        >
          <div class="flex sm:flex-cols-12 gap-4">
            <div class="col-span-1">
              <svg
                class="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
                />
              </svg>
            </div>
            <div class="col-span-2 pt-1.5">인증 완료</div>
          </div>
        </button>
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-0 p-12  bg-gray-100">
      <div className="w-1/3 bg-white rounded-lg py-2 shadow-lg hover:shadow-2xl transition duration-500 transform hover:scale-105 cursor-pointer">
        <img src={authRequest.image_url} alt="authImage" />
        <div className="flex flex-col items-center mb-2 space-x-4">
          <div className="flex flex-col items-center mb-2 space-x-4">
            <div className="mt-6 mb-4 text-2xl font-bold text-lack ">
              "{authRequest.request_user_nickname}" 쿤의 [
              {authRequest.challenge_name}] 인증 요청
            </div>
            <div className="text-2xl font-semibold text-gray-600 mt-2 mb-2 hover:underline">
              {authYear}년 {authMonth}월 {authDate}일 {authHour}시 {authMinute}
              분에 인증
            </div>
          </div>
        </div>
        <div>
          <div className="flex place-content-center content-start space-x-4 px-6 py-2">
            <div className="flex w-full bg-gray-300 rounded-lg px-2 py-2">
              <h1 className="flex w-full px-60 py-2 mb-3 text-xl font-semibold text-black border-1">
                "{authRequest.comments}"
              </h1>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-6 gap-4">
          <ApprovalButton />
          {/* <button
            type="button"
            class="flex max-w-sm w-full bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 focus:outline-none text-white text-2xl uppercase font-bold shadow-md rounded-lg mx-auto p-5"
            onClick={handleSubmit}
          >
            <div class="flex sm:flex-cols-12 gap-4">
              <div class="col-span-1">
                <svg
                  class="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
                  />
                </svg>
              </div>
              <div class="col-span-2 pt-1.5">인증 수락</div>
            </div>
          </button> */}
          <button
            type="button"
            class="flex max-w-sm w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:outline-none text-white text-2xl uppercase font-bold shadow-md rounded-lg mx-auto p-5"
            onClick={handleNavigate}
          >
            <div class="flex sm:flex-cols-12 gap-4">
              <div class="col-span-1">
                <svg
                  class="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
                  />
                </svg>
              </div>
              <div class="col-span-2 pt-1.5">챌린지룸으로 이동</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
