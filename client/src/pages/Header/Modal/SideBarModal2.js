import React, { useState } from "react";
import "./SideBarModal2.css";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../apis/index";

export default function SideBarModal2() {
  // console.log("alien밖: ", alien);
  const showModal2 = useSelector((state) => state.modalOnOff.showModal2);
  const alien = useSelector((state) => state.alien_auth_func.alien_auth);
  const dispatch = useDispatch();
  const [authImage, setAuthImage] = useState(null);
  const [authMessage, setAuthMessage] = useState("");

  console.log("authImage", authImage);
  console.log("authMessage", authMessage);

  const handleSubmit = async (e) => {
    // console.log("alien안: ", alien);
    // console.log("alien안_id: ", alien.alien.id);
    e.preventDefault();
    const res = await api.get("/main/s3Url");
    console.log("url", res.data.url);
    const { url } = res.data;
    console.log(url);

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
    console.log(imageUrl);
    console.log("문자적자", alien.alien.user_info_id);
    const resp = {
      user_info_id: alien.alien.user_info_id,
      Alien_id: alien.alien.id,
      Challenge_id: alien.alien.Challenge_id,
      comment: authMessage,
      imgURL: imageUrl,
    };

    // // dummy test용
    // const resp = {
    //   user_info_id: 1,
    //   Alien_id: 1,
    //   Challenge_id: 1,
    //   requestUserNickname: "John",
    //   comment: authMessage,
    //   imgURL: imageUrl,
    // };

    // post requst to my server to store any extra data
    const result = await api.post("/challenge/auth", resp);
    console.log(result);
  };

  return (
    <>
      {/* <div
        className={showModal2 ? "Background2" : null}
        onClick={() => {
          dispatch(actions.showModal2(false));
        }}
      /> */}
      <div>
        <div className={showModal2 ? "ModalContainer2" : "hidden2"}>
          <form id="imageForm">
            <p>인증하기 </p>
            <textarea
              type="text"
              placeholder="Comment"
              onChange={(e) => {
                setAuthMessage(e.target.value);
              }}
            ></textarea>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={(e) => {
                setAuthImage(e.target.files);
              }}
            ></input>
            <button type="button" onClick={handleSubmit}>
              사진 업로드
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
