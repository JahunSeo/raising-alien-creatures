import React, { useState } from "react";
import "./AuthRequestModal.css";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../../apis/index";
import * as actions from "../../../../Redux/actions/index.js";

export default function AuthRequestModal() {
  const showAuthRequest = useSelector(
    (state) => state.modalOnOff.showAuthRequest
  );
  const alien = useSelector((state) => state.alien_auth_func.alien_auth);
  const [authImage, setAuthImage] = useState(null);
  const [authMessage, setAuthMessage] = useState("");
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    /* 예외 처리 Handling 1. */
    let day = {
      1: "mon",
      2: "tue",
      3: "wed",
      4: "thu",
      5: "fri",
      6: "sat",
      0: "sun",
    };

    let date = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
    );
    let today = day[date.getDay()];
    if (alien.alien[today] === 0) {
      console.log("인증 가능 요일이 아닙니다.");
      return;
    } else {
    }

    /* 예외 처리 Handling 2. */
    if (alien.alien.practice_status > 0) {
      /* 해당 날짜에 이미 요청된 Alien 인 경우 -> front에서 Error 문구 처리 부탁드립니다. */
      console.log("이미 인증요청 완료된 건 입니다.");
      return;
    } else {
      alien.alien.practice_status = 1;
    }

    e.preventDefault();
    const res = await api.get("/main/s3Url");

    const { url } = res.data;
    // post the image direclty to the s3 bucket
    if (authImage) {
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: authImage[0],
      });
    }
    const imageUrl = url.split("?")[0];
    const resp = {
      user_info_id: alien.alien.user_info_id,
      alien_id: alien.alien.id,
      challenge_id: alien.alien.challenge_id,
      comments: authMessage,
      image_url: imageUrl,
    };

    // post requst to my server to store any extra data
    const result = await api.post("/challenge/auth", resp);
    console.log(result);
  };

  return (
    <div className={showAuthRequest ? "AuthRequestModal" : "hidden"}>
      {/* <div className="Overlay" /> */}
      <div className="flex flex-col fixed min-h-0 min-w-max max-h-full m-auto px-10 py-10 pt-12 justify-center bg-white rounded-xl shadow dark:bg-gray-800 z-10">
        <div className="md:flex">
          <div className="w-full px-4 py-6">
            <div className="mb-1">
              <span>인증 사진 첨부</span>
              <div className="Attachments">
                <div className="absolute">
                  <div className="flex flex-col items-center">
                    <i className="fa fa-folder-open fa-3x text-blue-700"></i>
                    <span className="block text-gray-400 font-normal">
                      클릭 또는 드래그하여 인증 사진을 올려주세요.
                    </span>
                  </div>
                </div>
                <input
                  type="file"
                  className="h-full w-full opacity-0"
                  name=""
                  accept="image/*"
                  id="imageInput"
                  onChange={(e) => {
                    setAuthImage(e.target.files);
                    // processImage(e);
                  }}
                />
              </div>
              <div className="mb-1">
                <span className="text-sm">코멘트</span>
                <textarea
                  type="text"
                  className="Comment"
                  placeholder="인증 사진과 실천 내용을 간단히 설명해주세요."
                  onChange={(e) => {
                    setAuthMessage(e.target.value);
                  }}
                ></textarea>
              </div>
            </div>
            {authImage && authImage[0] ? (
              <img src={URL.createObjectURL(authImage[0])}></img>
            ) : (
              <div></div>
            )}
            <div className="mt-3 text-right">
              <button
                className="ml-2 h-8 w-20 bg-gray-400 rounded text-white hover:bg-blue-700"
                onClick={() => {
                  dispatch(actions.showAuthRequest(false));
                }}
              >
                뒤로 가기
              </button>
              <button
                className="ml-2 h-8 w-20 bg-blue-600 rounded text-white hover:bg-blue-700"
                onClick={handleSubmit}
              >
                인증하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}