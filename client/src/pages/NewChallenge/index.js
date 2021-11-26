import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ReactSlider from "react-slider";
import api from "../../apis/index.js";
import "./index.module.css";
import Background from "../../image/createChallenge.jpeg";

export default function NewAlien(props) {
  // TODO: login 상태일 때만 접근할 수 있음
  // TODO: 챌린지에 접근 가능한 유저인지 확인해주어야 함
  const { user } = useSelector(({ user }) => ({ user: user.user }));

  const SELECT_DEFAULT = 0;
  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [challengeCapacity, setChallengeCapacity] = useState(SELECT_DEFAULT);
  const [challengeFrequency, setChallengeFrequency] = useState(SELECT_DEFAULT);
  const [challengeCategory, setChallengeCategory] = useState(SELECT_DEFAULT);
  const [challengeMessage, setChallengeMessage] = useState(null);

  function handleTitle(e) {
    setChallengeTitle(e.target.value);
  }

  function handleDescription(e) {
    setChallengeDescription(e.target.value);
  }

  function handleCapacity(challengeCapacity) {
    setChallengeCapacity(challengeCapacity);
  }

  function handleFrequency(e) {
    setChallengeFrequency(e.target.value);
  }

  function handleCategory(e) {
    setChallengeCategory(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !validateChallenge(
        challengeTitle,
        challengeDescription,
        challengeCapacity,
        challengeFrequency,
        challengeCategory
      )
    )
      return;

    setChallengeMessage(null);
    postChallenge();
  };
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/");
    return;
  };

  function validateChallenge(
    challengeTitle,
    challengeDescription,
    challengeCapacity,
    challengeFrequency,
    challengeCategory
  ) {
    if (
      challengeTitle === "" ||
      challengeDescription === "" ||
      challengeCapacity === 0 ||
      challengeFrequency === SELECT_DEFAULT ||
      challengeCategory === SELECT_DEFAULT
    ) {
      setChallengeMessage("입력하지 않은 챌린지 정보가 있습니다.");
      return false;
    }

    setChallengeMessage(null);
    return true;
  }

  const postChallenge = async () => {
    let challengeData = {
      challenge_name: challengeTitle,
      challenge_content: challengeDescription,
      max_user: challengeCapacity,
      cnt_of_week: challengeFrequency,
      tag: challengeCategory,
    };
    const res = await api.post("/challenge/create", challengeData);
    console.log("res", res);

    if (res.data.result === "success") {
      console.log("challengeData", challengeData);
      console.log(res.data.data);
      const challengeId = res.data.data.challenge_id;
      // 고민: 방장이 챌린지 생성 후 생명체를 만들지 않고 나가버리면 추후에 어떻게 챌린지방을 찾을 수 있는가?
      alert("챌린지 생성에 성공하였습니다.");
      navigate(`/challenge/${challengeId}/room`);
      return;
    } else {
      console.log("challengeData", challengeData);
      setChallengeMessage("입력하지 않은 챌린지 정보가 있습니다.");
      return;
    }
  };

  return (
    <div className="flex h-screen w-full justify-center items-center bg-gradient-to-r from-indigo-900 via-gray-700 to-purple-900 hover:from-purple-900 hover:via-gray-500 hover:to-indigo-900">
      <div className="min-w-max m-auto w-1/3 rounded-xl bg-gray-100 rounded shadow-2xl p-10">
        <h1 className="block w-full text-center text-2xl font-bold mb-6">
          새로운 챌린지 생성
        </h1>
        <div className="flex flex-col mb-4 p-4">
          <label className="mb-2 font-bold text-lg">챌린지 이름</label>
          <input
            className="border rounded-xl py-2 px-3"
            type="text"
            name="challenge_name"
            id="challenge_name"
            value={challengeTitle}
            onChange={handleTitle}
          />
        </div>

        <div class="flex flex-col min-w-max relative py-2 px-3">
          <label className="mb-2 font-bold text-lg">챌린지 카테고리</label>
          <select
            class="border rounded-xl pl-5 mb-4 bg-white hover:border-gray-400 focus:outline-none appearance-none"
            value={challengeCategory}
            onChange={handleCategory}
          >
            <option>카테고리 선택</option>
            <option>건강</option>
            <option>운동</option>
            <option>공부</option>
            <option>독서</option>
            <option>자기개발</option>
            <option>취미</option>
            <option>기타</option>
          </select>
        </div>

        <div className="flex flex-col mb-4 p-3">
          <label className="mb-2 font-bold text-lg">챌린지 설명</label>
          <textarea
            className="border rounded-xl py-2 px-3"
            rows="4"
            value={challengeDescription}
            onChange={handleDescription}
          ></textarea>
        </div>

        <div className="flex flex-col mb-4 p-3">
          <label className="mb-2 font-bold text-lg">최대 참여 인원</label>
          <ReactSlider
            step={5}
            min={0}
            max={100}
            valueLabelDisplay="on"
            className="w-full h-3 pr-2 my-4 bg-gray-200 rounded-md cursor-grab"
            thumbClassName="m-auto w-5 h-5 cursor-grab bg-indigo-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 -top-2px"
            value={challengeCapacity}
            onChange={handleCapacity}
          />
          <span>{challengeCapacity} 명</span>
        </div>

        <div className="flex flex-col mb-4 p-3">
          <label className="mb-2 rounded-xl font-bold text-lg">
            챌린지 참여 빈도
          </label>
          <select
            className="border rounded-xl"
            value={challengeFrequency}
            onChange={handleFrequency}
          >
            <option value={SELECT_DEFAULT}>참여 빈도 선택</option>
            <option value="7">매일 참여</option>
            <option value="6">주 6회 참여</option>
            <option value="5">주 5회 참여</option>
            <option value="4">주 4회 참여</option>
            <option value="3">주 3회 참여</option>
            <option value="2">주 2회 참여</option>
            <option value="1">주 1회 참여</option>
          </select>
        </div>

        <div className="flex-col min-w-max justify-center items-center py-2 px-3">
          <div className="text-center text-lg text-red-600 animate-pulse">
            <h1>{challengeMessage}</h1>
            <br />
          </div>
          <div className="flex justify-center">
            <button
              className="p-2 pl-5 pr-5 transition-colors duration-700 transform bg-indigo-500 hover:bg-blue-500 text-gray-100 text-lg rounded-lg focus:border-4 border-indigo-300"
              type="button"
              onClick={handleSubmit}
            >
              챌린지 생성
            </button>
            <button
              className="mx-5 p-2 pl-5 pr-5 transition-colors duration-700 transform bg-gray-300 hover:bg-gray-400 text-black-100 text-lg rounded-lg focus:border-4 border-indigo-300"
              type="button"
              onClick={handleCancel}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
