import React, { useState } from "react";
import "./SideBarModal2.css";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../../apis/index";
import * as actions from "../../../../Redux/actions/index.js";

export default function SideBarModal2() {
  // console.log("alien밖: ", alien);
  const showModal2 = useSelector((state) => state.modalOnOff.showModal2);
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
      Alien_id: alien.alien.id,
      Challenge_id: alien.alien.Challenge_id,
      comments: authMessage,
      image_url: imageUrl,
    };

    // post requst to my server to store any extra data
    const result = await api.post("/challenge/auth", resp);
    console.log(result);
  };

  return (
    <>
      <div>
        <div className={showModal2 ? "ModalContainer2" : "hidden2"}>
          <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden md:max-w-lg">
            <div className="md:flex">
              <div className="w-full px-4 py-6">
                <div className="mb-1">
                  <span className="text-sm"> Comment </span>
                  <textarea
                    type="text"
                    className="Comment"
                    onChange={(e) => {
                      setAuthMessage(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div className="mb-1">
                  <span className="text-sm text-gray-400">
                    인증 사진과 실천 내용을 간단히 설명해주세요.
                  </span>
                </div>
                <div className="mb-1">
                  <span>Attachments</span>
                  <div className="Attachments">
                    <div className="absolute">
                      <div className="flex flex-col items-center">
                        <i className="fa fa-folder-open fa-3x text-blue-700"></i>
                        <span className="block text-gray-400 font-normal">
                          Drag or Attach your files here
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
                </div>
                {authImage && authImage[0] ? (
                  <img src={URL.createObjectURL(authImage[0])}></img>
                ) : (
                  <div></div>
                )}
                <div className="mt-3 text-right">
                  <button
                    onClick={() => {
                      dispatch(actions.showModal2(false));
                    }}
                  >
                    뒤로 가기
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="
                ml-2
                h-8
                w-20
                bg-blue-600
                rounded
                text-white
                hover:bg-blue-700
              "
                  >
                    인증하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
