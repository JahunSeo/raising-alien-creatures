import React from "react";
import BabyShark from "../../image/babyshark.png";
// import "NoAuthRequest.css";

const NoAuthRequest = () => {
  const ApprovalButton = () => {
    return (
      <button
        type="button"
        className="flex justify-center items-center m-auto min-h-0 min-w-min max-w-sm w-full bg-gradient-to-r from-indigo-600 via-pink-600 to-red-600 hover:from-indigo-500 hover:via-pink-500 hover:to-yellow-500 focus:outline-none text-white text-2xl uppercase font-bold shadow-md rounded-lg mx-auto p-5"
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
          <div className="col-span-2 pt-2">인증 완료</div>
        </div>
      </button>
    );
  };

  return (
    <div className="flex h-screen min-w-min min-h-0 p-12 bg-center">
      <div className="flex-auto m-auto w-1/3 min-w-min justify-center rounded-lg py-2 shadow-lg hover:shadow-2xl transition duration-500 transform hover:scale-105 cursor-pointer">
        <img className="m-auto" src={BabyShark} alt="authImage" />
        <div className="flex flex-col items-center mb-2 space-x-4">
          <div className="mb-2 space-x-4">
            <div className="justify-center items-center mt-6 mb-4 text-2xl font-bold text-black">
              현재 수락을 기다리는 인증 요청이 없습니다.
            </div>
            <div className="flex flex-col justify-center items-center text-xl font-semibold text-gray-600 mt-2 mb-2">
              현재 수락을 기다리는 인증 요청이 없습니다.
            </div>
          </div>
        </div>
        <div>
          <div className="flex-col min-w-min w-full justify-center items-center space-x-4 px-6 py-2">
            <div className="flex-col m-auto bg-gray-300 rounded-lg px-2 py-2">
              <h1 className="flex justify-center items-center py-2 mb-3 text-xl font-semibold text-black">
                현재 수락을 기다리는 인증 요청이 없습니다.
              </h1>
            </div>
          </div>
        </div>
        <div className="flex min-w-min items-center justify-between px-6 py-6 gap-4">
          <ApprovalButton />
          <button
            type="button"
            className="flex justify-center items-center  min-w-min min-h-0 max-w-sm w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:outline-none text-white text-2xl uppercase font-bold shadow-md rounded-lg mx-auto p-5"
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
              <div className="m-auto col-span-2">인증 완료</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoAuthRequest;
