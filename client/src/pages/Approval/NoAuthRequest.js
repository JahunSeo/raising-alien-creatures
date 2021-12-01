import React from "react";
import BabyShark from "../../image/babyshark.png";
// import "NoAuthRequest.css";

const NoAuthRequest = () => {
  return (
    <div className="flex h-screen">
      <div className="flex-auto m-auto min-w-min justify-center rounded-lg py-2 shadow-lg hover:shadow-2xl transition duration-500 transform hover:scale-125 cursor-pointer">
        <img className="m-auto mt-6" src={BabyShark} alt="authImage" />
        <div className="flex flex-col items-center mb-2 space-x-4"></div>
        <div>
          <div className="flex-col min-w-min w-full justify-center items-center space-x-4 px-6 py-2">
            <div className="flex-col m-auto rounded-lg px-2 py-2">
              <h1 className="flex justify-center items-center py-2 mb-3 text-xl font-semibold text-black">
                현재 수락을 기다리는 인증 요청이 없습니다.
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoAuthRequest;
