import React, { useState } from "react";
import "./SideBarModal2.css";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../Redux/actions/index.js";
import api from "../../../../apis/index";

export default function SideBarModal2() {
  const showModal2 = useSelector((state) => state.modalOnOff.showModal2);
  const dispatch = useDispatch();

  const [authImage, setAuthImage] = useState(null);
  const [authMessage, setAuthMessage] = useState("");

  console.log("authImage", authImage);
  console.log("authMessage", authMessage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.get("/main/s3Url");
    console.log("url", res.data.url);

    const { url } = res.data;
    console.log(url);

    // post the image direclty to the s3 bucket
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: authImage[0],
    });
    const imageUrl = url.split("?")[0];
    console.log(imageUrl);

    // post requst to my server to store any extra data
  };

  return (
    <>
      <div
        className={showModal2 ? "Background2" : null}
        onClick={() => {
          dispatch(actions.showModal2(false));
        }}
      />
      <div>
        <div className={showModal2 ? "ModalContainer2" : "hidden"}>
          <form id="imageForm">
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
