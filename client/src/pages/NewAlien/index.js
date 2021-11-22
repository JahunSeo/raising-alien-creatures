import React, { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./index.module.css";

import DeanImage from "../../image/dean.png";
import babyshark from "../../image/babyshark.png";
import apis from "../../apis";

export default function NewChallenge(props) {
  let params = useParams();
  console.log("New Challenge params", params);

  const [AlienName, setAlienName] = useState("");
  const [KindOfAlien, setKindOfAlien] = useState("null");
  // TODO: login 상태일 때만 접근할 수 있음
  // TODO: 챌린지에 접근 가능한 유저인지 확인해주어야 함

  // 요일
  const week = ["일", "월", "화", "수", "목", "금", "토"];
  const now = new Date();
  const day = now.getDay();
  const today = week[day];

  // 생명체 생성 event
  const handleSubmit = (e) => {
    // e.preventDefault();
    postCreateAlien();
  };
  const postCreateAlien = async () => {
    let createAlienData = {
      Challenge_id: params,
      alienName: AlienName,
      auth_day: day,
      // totla_auth_cnt :
    };
    let res = await apis.post("/api/alien/create", createAlienData);
    console.log("res", res);
  };

  const AlienNum = (number) => {
    setKindOfAlien(number);
    console.log(KindOfAlien);
  };

  return (
    <div className={styles.body}>
      <div className=" w-1/2 px-3 sm:mt-40">
        <label
          className=" overflow-visible block uppercase tracking-wide text-gray-700 text-s font-bold mb-2"
          for="grid-first-name"
        >
          생명체 이름
        </label>
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:ring-blue-400 focus:bg-white"
          id="grid-first-name"
          type="text"
          placeholder="정글특전대"
          onChange={(e) => {
            setAlienName(e.target.value);
          }}
        ></input>
      </div>
      <div className="container w-1/2 pl-3 py-6 font-bold text-gray-700">
        <div>
          생명체의 챌린지 시작일은{" "}
          <span style={{ color: "red" }}>'{today}요일'</span> 입니다.
        </div>
      </div>
      <div className=" container top-60 border-gray-500 w-1/2 px-3 py-3 mb-3">
        <ul className="relative px-1 py-1 inline-flex">
          <li className=" mr-1 inline-block ">
            <a className="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold">
              기본
            </a>
          </li>
          <li className="mr-1 inline-block">
            <a className="bg-white inline-block py-2 px-4 text-blue-500  font-semibold">
              꾸미기
            </a>
          </li>
        </ul>
        <div className="border md:p-3">
          <div class={styles.slider}>
            <input
              type="radio"
              name="slide"
              id="slide1"
              onClick={() => AlienNum(1)}
            />
            <input
              type="radio"
              name="slide"
              id="slide2"
              onClick={() => AlienNum(2)}
            />
            <input
              type="radio"
              name="slide"
              id="slide3"
              onClick={() => AlienNum(3)}
            />
            <input
              type="radio"
              name="slide"
              id="slide4"
              onClick={() => AlienNum(4)}
            />
            <ul id="imgholder" class="imgs">
              <li>
                <img src={babyshark} alt={"이미지 로딩 실패"} />
              </li>
              <li>
                <img className="" src={babyshark} alt={"이미지 로딩 실패"} />
              </li>
              <li>
                <img src={babyshark} alt={"이미지 로딩 실패"} />
              </li>
              <li>
                <img src={babyshark} alt={"이미지 로딩 실패"} />
              </li>
            </ul>
            <div class={styles.bullets}>
              <label htmlFor="slide1">&nbsp;</label>
              <label htmlFor="slide2">&nbsp;</label>
              <label htmlFor="slide3">&nbsp;</label>
              <label htmlFor="slide4">&nbsp;</label>
            </div>
          </div>
        </div>
      </div>
      <button
        className=" bottom-0 border py-1 px-3 rounded shadow-sm text-white bg-blue-300 hover:bg-blue-400 font-semibold"
        onClick={handleSubmit}
      >
        생명체 생성
      </button>
    </div>
  );
}
