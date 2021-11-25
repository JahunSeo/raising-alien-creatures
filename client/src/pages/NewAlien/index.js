import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import styles from "./index.module.css";
import api from "../../apis";
import AlienSlide from "./AlienSlide/index.js";
import AlienInfo from "./AlienInfo/index.js";

export default function NewChallenge(props) {
  let params = useParams();
  // console.log("New Challenge params", params);
  const [authCount, setAuthCount] = useState("");
  // 생명체 정보
  const [alienName, setAlienName] = useState("");
  const [alienNumber, setAlienNumber] = useState(0);
  // 인증 요일
  const [checkDay, setCheckDay] = useState([]);
  const [sun, setSun] = useState(0);
  const [mon, setMon] = useState(0);
  const [tue, setTue] = useState(0);
  const [wed, setWed] = useState(0);
  const [thu, setThu] = useState(0);
  const [fri, setFri] = useState(0);
  const [sat, setSat] = useState(0);
  // validation
  const [creAlienMessage, setCreAlienMessage] = useState(null);
  // 링크 이동
  const navigate = useNavigate();

  // TODO: login 상태일 때만 접근할 수 있음
  // TODO: 챌린지에 접근 가능한 유저인지 확인해주어야 함

  // 기본 생명체 번호 계산
  let aNumber = alienNumber;
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

  // 인증 요일
  useEffect(() => {
    if (checkDay.includes("sun")) setSun(1);
    if (checkDay.includes("mon")) setMon(1);
    if (checkDay.includes("tue")) setTue(1);
    if (checkDay.includes("wed")) setWed(1);
    if (checkDay.includes("thu")) setThu(1);
    if (checkDay.includes("fri")) setFri(1);
    if (checkDay.includes("sat")) setSat(1);
  }, [checkDay]);

  function validateCreAlien(alienName, checkDay, authCount) {
    if (!alienName) {
      setCreAlienMessage("생명체 이름을 지어주세요!");
      return false;
    }
    if (!checkDay.length) {
      setCreAlienMessage("인증 요일을 선택해주세요!");
      return false;
    }
    console.log(111, checkDay.length);
    console.log(221, authCount);
    if (checkDay.length !== authCount) {
      console.log("hihi");
      setCreAlienMessage("인증 횟수를 확인해주세요!");
      return false;
    }
    setCreAlienMessage(null);
    return true;
  }
  console.log("dfdf", authCount);
  // 생명체 생성 event
  const handleSubmit = (e) => {
    // e.preventDefault();

    if (!validateCreAlien(alienName, checkDay, authCount)) return;
    console.log("alienNumber:", alienNumber);
    postCreateAlien();
  };

  const postCreateAlien = async () => {
    let createAlienData = {
      challenge_id: params.challengeId,
      alien_name: alienName,
      alien_image: aNumber,
      total_auth_cnt: authCount,
      sun: sun,
      mon: mon,
      tue: tue,
      wed: wed,
      thu: thu,
      fri: fri,
      sat: sat,
    };
    await api.post("/alien/create", createAlienData);
    // console.log("res", res);
    alert("생명체 생성을 성공하였습니다!");

    navigate(`/challenge/${params.challengeId}/room`);
    // <Link to={`/challenge/${params.challengeId}/room`} />;
  };

  useEffect(() => {
    // cntOfWeek
    try {
      const getChalData = async () => {
        let res = await api.get(
          `/challenge/totalAuthCnt/${params.challengeId}`
        );
        if (res.data.cntOfWeek) {
          setAuthCount(res.data.cntOfWeek);
        }
      };
      getChalData();
    } catch (err) {
      console.error("fetchData fail", err);
    }
  }, [params]);

  // console.log("checkDay", checkDay); // log 2번 찍힘
  return (
    <div className={styles.body}>
      <div className="container w-2/5 min-w-max">
        <AlienInfo
          setAlienName={setAlienName}
          authCount={authCount}
          checkDay={checkDay}
          setCheckDay={setCheckDay}
        />

        <div className=" container top-60 border-gray-500 w-1/2 px-3 py-3 mb-3">
          <ul className="relative px-1 py-1 inline-flex min-w-max">
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
          <div className="border p-5 md:p-10 w-full min-w-max">
            <AlienSlide
              alienNumber={alienNumber}
              setAlienNumber={setAlienNumber}
            />
          </div>
        </div>
        <div className="pb-3 px-3 text-red-500 font-semibold text-center">
          {creAlienMessage}
        </div>
        <div className="flex justify-center pb-5">
          <button
            className="border py-1 px-3 rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 font-semibold"
            onClick={handleSubmit}
          >
            생명체 생성
          </button>
        </div>
      </div>
    </div>
  );
}
