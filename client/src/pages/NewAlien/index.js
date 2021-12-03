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
  const [alienCategory, setAlienCategory] = useState({
    type: "fish",
    angle: 60,
    divider: 6,
  });
  // 인증 요일
  const [checkDay, setCheckDay] = useState([]);

  // validation
  const [creAlienMessage, setCreAlienMessage] = useState(null);
  // 링크 이동
  const navigate = useNavigate();
  // 팝업
  const dispatch = useDispatch();
  // 중복 생성 요청 방지
  const [alienClicked, setAlienClicked] = useState(false);

  // 기본 생명체 번호 계산
  let aNumber = alienNumber;
  if (aNumber >= 0) {
    aNumber = aNumber % alienCategory.divider;
    while (aNumber < 0) {
      aNumber += alienCategory.divider;
    }
  } else {
    aNumber %= alienCategory.divider;
    while (aNumber < 0) {
      aNumber += alienCategory.divider;
    }
    if (aNumber === -0) {
      aNumber = 0;
    }
  }
  if (alienCategory.type === "fish") {
    aNumber += 10;
  } else if (alienCategory.type === "seal") {
    aNumber += 20;
  } else if (alienCategory.type === "puffish") {
    aNumber += 30;
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
  }, [challengeId, user.login, user.challenges]);

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
    if (alienClicked) return;
    if (!validateCreAlien(alienName, checkDay, authCount)) return;
    setAlienClicked(true);
    postCreateAlien();
  };
  // 캐릭터 선택탭
  const handleTap = (e) => {
    setAlienNumber(0);
    if (e === "fish") {
      setAlienCategory({ type: "fish", angle: 60, divider: 6 });
    } else if (e === "seal") {
      setAlienCategory({ type: "seal", angle: 90, divider: 4 });
    } else if (e === "puffish") {
      setAlienCategory({ type: "puffish", angle: 90, divider: 4 });
    } else return;
  };

  // Alien 정보 api 보내기
  const postCreateAlien = async () => {
    let createAlienData = {
      challenge_id: challengeId,
      alien_name: alienName,
      image_url: aNumber,
      times_per_week: authCount,
      sun: Number(checkDay.includes("sun")),
      mon: Number(checkDay.includes("mon")),
      tue: Number(checkDay.includes("tue")),
      wed: Number(checkDay.includes("wed")),
      thu: Number(checkDay.includes("thu")),
      fri: Number(checkDay.includes("fri")),
      sat: Number(checkDay.includes("sat")),
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

  console.log("alienClicked", alienClicked);
  // console.log("checkDay", checkDay);
  return (
    <div className={styles.body}>
      <div className="container w-2/5 min-w-max">
        <AlienInfo
          setAlienName={setAlienName}
          authCount={authCount}
          checkDay={checkDay}
          setCheckDay={setCheckDay}
        />
        <div style={{ padding: "20px 10px 20px" }}>
          <ul
            className="NotiList"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <li className="NotiItem">
              선택하는 요일에 한해 인증할 수 있습니다.
            </li>
            <li>해당 요일에 인증하지 않으면 생명체는 사망합니다.</li>
          </ul>
        </div>

        <div className="container top-60 border-gray-500 w-1/2 px-3 py-3 mb-3">
          <ul className="relative px-1 py-1 inline-flex min-w-max">
            <li className=" mr-1 inline-block ">
              <button
                className={
                  alienCategory.type === "fish"
                    ? "bg-white inline-block border-gray-400 border-l-2 border-t-2 border-r-2 rounded-t py-2 px-4 text-indigo-700 font-semibold"
                    : "bg-white inline-block py-2 px-4 text-indigo-700 font-semibold hover:text-red-600"
                }
                onClick={() => handleTap("fish")}
              >
                뿡어
              </button>
            </li>
            <li className="mr-1 inline-block">
              <button
                className={
                  alienCategory.type === "seal"
                    ? "bg-white inline-block border-gray-400 border-l-2 border-t-2 border-r-2 rounded-t py-2 px-4 text-indigo-700  font-semibold"
                    : "bg-white inline-block py-2 px-4 text-indigo-700  font-semibold hover:text-red-600"
                }
                onClick={() => handleTap("seal")}
              >
                물개
              </button>
            </li>
            <li className="mr-1 inline-block">
              <button
                className={
                  alienCategory.type === "puffish"
                    ? "bg-white inline-block border-gray-400 border-l-2 border-t-2 border-r-2 rounded-t py-2 px-4 text-indigo-700  font-semibold"
                    : "bg-white inline-block py-2 px-4 text-indigo-700  font-semibold hover:text-red-600"
                }
                onClick={() => handleTap("puffish")}
              >
                복어
              </button>
            </li>
          </ul>

          <div className="rounded border-2 border-gray-400 md:p-5 w-full min-w-max">
            <AlienSlide
              alienNumber={alienNumber}
              setAlienNumber={setAlienNumber}
              alienCategory={alienCategory}
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
