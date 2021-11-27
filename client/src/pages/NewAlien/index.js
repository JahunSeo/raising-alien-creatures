import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../Redux/actions";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import styles from "./index.module.css";
import api from "../../apis";
import AlienSlide from "./AlienSlide";
import AlienInfo from "./AlienInfo";

export default function NewAlien(props) {
  const { challengeId } = useParams();
  const { user } = useSelector(({ user }) => ({ user: user.user }));
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
  // 팝업
  const dispatch = useDispatch();

  // 기본 생명체 번호 계산
  let aNumber = alienNumber;
  if (aNumber >= 0) {
    aNumber = aNumber % 8;
    while (aNumber < 0) {
      aNumber += 8;
    }
  } else {
    aNumber %= 8;
    while (aNumber < 0) {
      aNumber += 8;
    }
    if (aNumber === -0) {
      aNumber = 0;
    }
  }

  useEffect(() => {
    // cntOfWeek
    try {
      const getChalData = async () => {
        // 본 챌린지에 참가중인지 확인
        let participating;
        if (user.login && user.challenges) {
          participating =
            user.challenges.findIndex((c) => c.id === Number(challengeId)) !==
            -1;
        }
        if (!user.login || participating) return;
        let res = await api.get(`/challenge/totalAuthCnt/${challengeId}`);
        if (res.data.result === "success") {
          setAuthCount(res.data.times_per_week);
        } else {
          // TODO: error handling 필요한가?
        }
      };
      getChalData();
    } catch (err) {
      console.error("fetchData fail", err);
    }
  }, [challengeId]);

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
  // validation
  function validateCreAlien(alienName, checkDay, authCount) {
    if (!alienName) {
      setCreAlienMessage("생명체 이름을 지어주세요!");
      return false;
    }
    if (!checkDay.length) {
      setCreAlienMessage("인증 요일을 선택해주세요!");
      return false;
    }
    if (checkDay.length !== authCount) {
      setCreAlienMessage("인증 횟수를 확인해주세요!");
      return false;
    }
    setCreAlienMessage(null);
    return true;
  }
  // 생명체 생성 event
  const handleSubmit = (e) => {
    // e.preventDefault();
    // validation check
    if (!validateCreAlien(alienName, checkDay, authCount)) return;
    postCreateAlien();
  };
  // Alien 정보 api 보내기
  const postCreateAlien = async () => {
    let createAlienData = {
      challenge_id: challengeId,
      alien_name: alienName,
      image_url: aNumber,
      times_per_week: authCount,
      sun: sun,
      mon: mon,
      tue: tue,
      wed: wed,
      thu: thu,
      fri: fri,
      sat: sat,
    };

    const response = await api.post("/alien/create", createAlienData);
    console.log("res", response);
    if (response.data.result === "access_deny_full") {
      // 1) 종류 2) 메세지 문구 3) SUCC or FAIL에 따른 아이콘 변경 4) callback함수(사실 여기선 별 효과 없음)
      dispatch(
        actions.setPopupModal(
          "CREATE_ALIEN",
          "방의 정원이 가득 찼습니다 !",
          "FAIL",
          () => {
            navigate(`/challenge/${challengeId}/room`);
          }
        )
      );
      return;
    }

    if (response.data.result === "fail_already_participant") {
      dispatch(
        actions.setPopupModal(
          "CREATE_ALIEN",
          "이미 참가중인 챌린지입니다 !",
          "FAIL",
          () => {
            navigate(`/challenge/${challengeId}/room`);
          }
        )
      );
      return;
    }

    dispatch(
      actions.setPopupModal(
        "CREATE_ALIEN",
        "생명체가 생성되었습니다 !",
        "SUCC",
        () => {
          navigate(`/challenge/${challengeId}/room`);
        }
      )
    );
    dispatch(actions.joinChallenge({ id: parseInt(challengeId) }));
  };

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
            className="border py-1 px-3 rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 text-font-semibold"
            onClick={handleSubmit}
          >
            생명체 생성
          </button>
        </div>
      </div>
    </div>
  );
}
