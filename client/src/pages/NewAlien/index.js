import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./index.module.css";
import apis from "../../apis";
import AlienSlide from "./AlienSlide/index.js";
import DayCheckBox from "./DayCheckBox/index.js";

export default function NewChallenge(props) {
  let params = useParams();
  // console.log("New Challenge params", params);

  const [alienName, setAlienName] = useState("");
  const [alienNumber, setAlienNumber] = useState(0);
  const [authCount, setAuthCount] = useState("");
  // TODO: login 상태일 때만 접근할 수 있음
  // TODO: 챌린지에 접근 가능한 유저인지 확인해주어야 함

  // 요일
  const week = ["일", "월", "화", "수", "목", "금", "토"];
  const now = new Date();
  const day = now.getDay();
  const today = week[day];

  let aNumber = alienNumber;

  // 생명체 생성 event
  const handleSubmit = (e) => {
    // e.preventDefault();
    console.log("alienNumber:", alienNumber);
    // postCreateAlien();
  };

  // const postCreateAlien = async () => {
  //   let createAlienData = {
  //     Challenge_id: params,
  //     alien_Name: alienName,
  //     alien_image: aNumber
  //     total_auth_cnt: authCount,
  //     sun: ,
  //     mon: ,
  //     tue: ,
  //     wed: ,
  //     thu: ,
  //     fri: ,
  //     sat:
  //   };
  //   let res = await apis.post("/api/alien/create", createAlienData);
  //   console.log("res", res);
  // };

  // const getAlienNum = (aNumber) => {
  //   setAlienNumber(aNumber);
  //   console.log(aNumber);
  // };

  useEffect(() => {
    console.log("생명체 생성방 마운트 될때만 실행.");
    const getChalData = async () => {
      let res = await apis.get("/challenge/create");
      if (res.data.data) {
        setAuthCount(res.data.data);
        console.log("res 데이터", res.data.data);
      }
    };
    getChalData();
  }, []);

  // 캐릭터 넘버 계산
  if (aNumber >= 0) {
    aNumber = -aNumber % 8;
    while (aNumber < 0) {
      aNumber += 8;
    }
    if (aNumber === -0) {
      aNumber = 0;
    }
  } else {
    aNumber = -aNumber;
    aNumber %= 8;
    while (aNumber < 0) {
      aNumber += 8;
    }
  }

  return (
    <div className={styles.body}>
      <DayCheckBox setAlienName={setAlienName} />

      <div className=" container top-60 border-gray-500 w-1/2 px-3 py-3 mb-3">
        <ul className="relative px-1 py-1 inline-flex">
          <li className=" mr-1 inline-block ">
            <a className="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold">
              캐릭터 선택
            </a>
          </li>
          {/* <li className="mr-1 inline-block">
              <a className="bg-white inline-block py-2 px-4 text-blue-500  font-semibold">
                꾸미기
              </a>
            </li> */}
        </ul>
        <div className="border p-10 md:p-10 ">
          <AlienSlide
            alienNumber={alienNumber}
            setAlienNumber={setAlienNumber}
          />
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
