import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../Redux/actions";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import styles from "./index.module.css";
import api from "../../apis";
import AlienSlide from "./AlienSlide";
import AlienInfo from "./AlienInfo";

export default function NewAlien() {
  const { challengeId } = useParams();
  const { user } = useSelector(({ user }) => ({ user: user.user }));
  const [authCount, setAuthCount] = useState("");
  // 생명체 정보
  const [alienName, setAlienName] = useState("");
  const [alienNumber, setAlienNumber] = useState(0);
  const [alienCategory, setAlienCategory] = useState({
    type: "fish",
    angle: 60,
    divider: 6,
  });
  const [imageInfo, setImageInfo] = useState(null);
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
  // 첫번째 생물은 10~ 두번째 20~ 세번째 30~
  if (imageInfo) {
    if (alienCategory.type === imageInfo[0].species) {
      aNumber += 10;
    } else if (alienCategory.type === imageInfo[1].species) {
      aNumber += 20;
    } else if (alienCategory.type === imageInfo[2].species) {
      aNumber += 30;
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
        let res = await api.get(`/alien/imageInfo/${challengeId}`);
        if (res.data.result === "success") {
          setAuthCount(res.data.times_per_week);
          setImageInfo(res.data.images);
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
    if (e === imageInfo[0].species) {
      setAlienCategory({
        type: imageInfo[0].species,
        angle: parseInt(360 / imageInfo[0].count),
        divider: imageInfo[0].count,
      });
    } else if (e === imageInfo[1].species) {
      setAlienCategory({
        type: imageInfo[1].species,
        angle: parseInt(360 / imageInfo[1].count),
        divider: imageInfo[1].count,
      });
    } else if (e === imageInfo[2].species) {
      setAlienCategory({
        type: imageInfo[2].species,
        angle: parseInt(360 / imageInfo[2].count),
        divider: imageInfo[2].count,
      });
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

  return (
    <div className={styles.body}>
      <div className="container w-2/5 min-w-max">
        <AlienInfo
          setAlienName={setAlienName}
          authCount={authCount}
          checkDay={checkDay}
          setCheckDay={setCheckDay}
        />

        <div className="container top-60 border-gray-500 w-1/2 px-3 py-3 mb-3">
          <div className=" overflow-visible block uppercase tracking-wide text-gray-700 text-lg font-bold mb-2 xl:text-2xl xl:pb-5 2xl:text-3xl 2xl:pb-7">
            생명체 선택
          </div>
          <ul className="relative px-1 py-1 inline-flex min-w-max">
            <li className=" mr-1 inline-block ">
              <button
                className={
                  alienCategory.type === "fish"
                    ? "bg-white inline-block border-gray-400 border-l-2 border-t-2 border-r-2 rounded-t py-2 px-4 text-indigo-700 font-semibold xl:text-2xl 2xl:text-3xl"
                    : "bg-white inline-block py-2 px-4 text-indigo-700 font-semibold hover:text-red-600 xl:text-2xl 2xl:text-3xl"
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
                    ? "bg-white inline-block border-gray-400 border-l-2 border-t-2 border-r-2 rounded-t py-2 px-4 text-indigo-700  font-semibold xl:text-2xl 2xl:text-3xl"
                    : "bg-white inline-block py-2 px-4 text-indigo-700  font-semibold hover:text-red-600 xl:text-2xl 2xl:text-3xl"
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
                    ? "bg-white inline-block border-gray-400 border-l-2 border-t-2 border-r-2 rounded-t py-2 px-4 text-indigo-700  font-semibold xl:text-2xl 2xl:text-3xl"
                    : "bg-white inline-block py-2 px-4 text-indigo-700  font-semibold hover:text-red-600 xl:text-2xl 2xl:text-3xl"
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
              imageInfo={imageInfo}
            />
          </div>
        </div>

        <div className="pb-3 px-3 text-red-500 font-semibold text-center">
          {creAlienMessage}
        </div>
        <div className="flex justify-center pb-5">
          <button
            className="xl:text-xl 2xl:text-2xl text-lg border py-2 px-4 rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 text-font-semibold"
            onClick={handleSubmit}
          >
            생명체 생성
          </button>
        </div>
      </div>
    </div>
  );
}
