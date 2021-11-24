import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import api from "../../apis/index.js";
import NoAuthRequest from "./NoAuthRequest.js";

export default function Approval(props) {
  const { user } = useSelector(({ user }) => ({ user: user.user }));

  const [authRequests, setAuthRequests] = useState([]);

  useEffect(() => {
    const loadAuthRequests = async () => {
      const res = await api.get("/user/approval/list");
      if (!res.data.data.length) {
        console.log("res", res);
        console.log("현재 수락을 기다리는 인증 요청이 없습니다.");
      } else {
        setAuthRequests(res.data.data);
        return;
      }
    };
    loadAuthRequests();
  }, []);

  console.log("authRequests", authRequests);

  if (authRequests.length) {
    return (
      <div className="authRequests">
        {authRequests.map((authRequest) => (
          <AuthRequest key={authRequest.id} authRequest={authRequest} />
        ))}
      </div>
    );
  } else {
    return (
      <div className="noAuthRequest">
        <NoAuthRequest />
      </div>
    );
  }
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
    const req = await api.post("/challenge/approval", {
      auth_id: authRequest.authentification_id,
      Alien_id: authRequest.alien_id,
      request_date: authRequest.request_id,
    });
    console.log("req", req);
    if (req.data.result === "success") {
      alert(`${authRequest.request_user_nickname} 님의 인증을 수락하였습니다.`);
      SetApprovalStatus(true);
    }
  };

  const handleSubmit = () => {
    postApproval();
  };

  const handleNavigate = () => {
    navigate(`/challenge/${authRequest.challenge_id}/room`);
  };

  const ApprovalButton = () => {
    if (!approvalStatus & !authRequest.isAuth) {
      return (
        <button
          type="button"
          className="flex justify-center items-center min-h-0 min-w-min max-w-sm w-full bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 focus:outline-none text-white text-2xl uppercase font-bold shadow-md rounded-lg mx-auto p-5"
          onClick={handleSubmit}
        >
          <div className="flex sm:flex-cols-12 gap-2">
            <div className="col-span-1">
              <svg
                className="h-12 w-12"
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
            <div className="m-auto col-span-2 pt-1.5">인증 수락</div>
          </div>
        </button>
      );
    } else {
      return (
        <button
          type="button"
          className="flex justify-center items-center min-h-0 min-w-min max-w-sm w-full bg-gradient-to-r from-indigo-600 via-pink-600 to-red-600 hover:from-indigo-500 hover:via-pink-500 hover:to-yellow-500 focus:outline-none text-white text-2xl uppercase font-bold shadow-md rounded-lg mx-auto p-5"
        >
          <div className="flex sm:flex-cols-12 gap-2">
            <div className="col-span-1">
              <svg
                className="h-12 w-12"
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
            <div className="m-auto col-span-2 pt-2">인증 완료</div>
          </div>
        </button>
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-w-min min-h-0 p-12  bg-gray-100">
      <div className="w-1/3 min-w-min bg-white rounded-lg py-2 shadow-lg hover:shadow-2xl transition duration-500 transform hover:scale-105 cursor-pointer">
        <img src={authRequest.image_url} alt="authImage" />
        <div className="flex flex-col items-center mb-2 space-x-4">
          <div className="mb-2 space-x-4">
            <div className="justify-center items-center mt-6 mb-4 text-2xl font-bold text-black">
              "{authRequest.request_user_nickname}" 님의 [
              {authRequest.challenge_name}] 인증 요청
            </div>
            <div className="flex flex-col justify-center items-center text-xl font-semibold text-gray-600 mt-2 mb-2">
              {authYear}년 {authMonth}월 {authDate}일 {authHour}시 {authMinute}
              분에 인증
            </div>
          </div>
        </div>
        <div>
          <div className="flex-col min-w-min w-full justify-center items-center space-x-4 px-6 py-2">
            <div className="flex-col m-auto bg-gray-300 rounded-lg px-2 py-2">
              <h1 className="flex justify-center items-center py-2 mb-3 text-xl font-semibold text-black">
                "{authRequest.comments}"
              </h1>
            </div>
          </div>
        </div>
        <div className="flex min-w-min items-center justify-between px-6 py-6 gap-4">
          <ApprovalButton />
          <button
            type="button"
            className="flex justify-center items-center min-w-min min-h-0 max-w-sm w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:outline-none text-white text-2xl uppercase font-bold shadow-md rounded-lg mx-auto p-5"
            onClick={handleNavigate}
          >
            <div className="flex sm:flex-cols-12 gap-2">
              <div className="col-span-1">
                <svg
                  className="h-12 w-12"
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
              <div className="m-auto col-span-2">챌린지룸 이동</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
