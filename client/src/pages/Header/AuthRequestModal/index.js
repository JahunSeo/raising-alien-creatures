import React, { useState } from "react";
import "./AuthRequestModal.css";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../apis/index";
import * as actions from "../../../Redux/actions/index.js";

export default function AuthRequestModal(props) {
  const [authImage, setAuthImage] = useState(null);
  const [authMessage, setAuthMessage] = useState("");
  const dispatch = useDispatch();

  const showAuthRequest = useSelector(
    (state) => state.modalOnOff.showAuthRequest
  );
  const { aliens, selectedAlien } = useSelector(({ room }) => ({
    aliens: room.aliens,
    selectedAlien: room.selectedAlien,
  }));
  const alien = aliens.find((a) => a.id === selectedAlien);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    if (alien[today] === 0) {
      console.log("인증 가능 요일이 아닙니다.");
      return;
    } else {
    }

    /* 예외 처리 Handling 2. */
    if (alien.practice_status > 0) {
      /* 해당 날짜에 이미 요청된 Alien 인 경우 -> front에서 Error 문구 처리 부탁드립니다. */
      console.log("이미 인증요청 완료된 건 입니다.");
      return;
    }

    let res = await api.get("/main/s3Url");
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
      user_info_id: alien.user_info_id,
      alien_id: alien.id,
      challenge_id: alien.challenge_id,
      comments: authMessage,
      image_url: imageUrl,
    };

    // post requst to my server to store any extra data
    res = await api.post("/challenge/auth", resp);
    if (res.data.result === "success") {
      dispatch(actions.requestAuth(alien.id));
    } else {
      // TODO: 실패 처리
    }
  };

  const handleCancel = () => {
    dispatch(actions.showAuthRequest(false));
  };

  if (!showAuthRequest) {
    return <div />;
  }

  if (!alien) {
    // TODO: handle error
    return <div></div>;
  }

  return (
    <div>
      <div className={"Overlay"} />
      <div className={"AuthRequestModal"}>
        <div className="flex flex-col fixed min-w-max px-8 py-8 justify-center bg-indigo-50 rounded-xl shadow dark:bg-gray-800 overflow-y-auto z-10">
          <div className="flex justify-center items-center self-end text-gray-400 hover:text-gray-500">
            <svg
              className="fixed w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              onClick={handleCancel}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          <div className="w-full px-4 py-4 text-lg">
            <div className="pb-8">
              <h2 className="text-3xl font-bold">{alien.challenge_name}</h2>
            </div>
            <div className="pb-4">
              <label className="text-xl font-bold">인증 사진 첨부</label>
            </div>
            <div className="Attachments">
              <div className="flex flex-col fixed min-h-0 min-w-max items-center">
                <i className="fa fa-folder-open fa-3x text-blue-700" />
                <span className="block text-gray-400 font-normal">
                  클릭 또는 드래그하여 인증 사진을 올려주세요.
                </span>
              </div>
              <input
                type="file"
                className="h-full w-full opacity-0"
                name=""
                accept="image/*"
                id="imageInput"
                onChange={(e) => {
                  setAuthImage(e.target.files);
                }}
              />
            </div>
            <div className="justify-center items-center">
              <div className="py-4">
                <label className="text-xl font-bold">간단 코멘트</label>
              </div>
              <textarea
                type="text"
                className="Comment"
                placeholder="인증 사진과 실천 내용을 간단히 설명해주세요."
                onChange={(e) => {
                  setAuthMessage(e.target.value);
                }}
              ></textarea>
            </div>
            {authImage && authImage[0] ? (
              <div className="max-w-md py-6">
                <img
                  style={{
                    maxHeight: "200px",
                    maxWidth: "100%",
                    margin: "auto",
                  }}
                  src={URL.createObjectURL(authImage[0])}
                  alt="auth"
                />
              </div>
            ) : (
              <div></div>
            )}
            <div className="mt-6">
              <button
                type="button"
                className="ml-2 h-8 w-20 bg-gray-400 rounded text-white hover:bg-blue-700"
                onClick={() => {
                  setAuthImage(null);
                }}
              >
                첨부 취소
              </button>
              <button
                type="button"
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
