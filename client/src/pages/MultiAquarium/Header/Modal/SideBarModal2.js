import React, { useState } from "react";
import "./SideBarModal2.css";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../Redux/actions/index.js";
import api from "../../../../apis/index";

export default function SideBarModal2(props) {
  const { alien } = props;
  console.log("props: ", props);
  console.log("alien밖: ", alien);

  const showModal2 = useSelector((state) => state.modalOnOff.showModal2);
  const dispatch = useDispatch();
  // console.log("여기여기", alien);
  const [authImage, setAuthImage] = useState(null);
  const [authMessage, setAuthMessage] = useState("");

  console.log("authImage", authImage);
  console.log("authMessage", authMessage);

  const handleSubmit = async (e) => {
    console.log("alien안: ", { alien });
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

    // resp = {  alien : al , comment : authMessage , imgURL : imageUrl;}

    // let authData = {};
    // const res = await api.post("", authData);
    // console.log("res", res);
    // if (res.data.result === "success") {
    // }

    // post requst to my server to store any extra data
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
