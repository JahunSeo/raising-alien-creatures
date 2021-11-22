import React, { useState } from "react";
import styles from "./index.module.css";
import api from "../../apis/index.js";

export default function NewAlien(props) {
  // TODO: login 상태일 때만 접근할 수 있음
  // TODO: 챌린지에 접근 가능한 유저인지 확인해주어야 함
  const SELECT_DEFAULT = 0;
  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [challengeCapacity, setChallengeCapacity] = useState(SELECT_DEFAULT);
  const [challengeFrequency, setChallengeFrequency] = useState(SELECT_DEFAULT);
  const [challengeTag, setChallengeTag] = useState("");
  const [challengeMessage, setChallengeMessage] = useState(null);
  

  function handleChallengeTitle(e) {
    setChallengeTitle(e.target.value);
  }

  function handleChallengeDescription(e) {
    setChallengeDescription(e.target.value);
  }

  function handleChallengeCapacity(e) {
    setChallengeCapacity(e.target.value);
  }

  function handleChallengeFrequency(e) {
    setChallengeFrequency(e.target.value);
  }

  function handleChallengeTag(e) {
    setChallengeTag(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // 입력하지 않은 것이 있는지 확인
    if (
      !validateChallenge(
        challengeTitle,
        challengeDescription,
        challengeCapacity,
        challengeFrequency
      )
    )
      return;
    
    setChallengeMessage(null);
    postChallenge();
  };

  function validateChallenge(
    challengeTitle,
    challengeDescription,
    challengeCapacity,
    challengeFrequency,
    challengeTag,
  ) {
    if (
      challengeTitle === "" ||
      challengeDescription === "" ||
      challengeCapacity === SELECT_DEFAULT ||
      challengeFrequency === SELECT_DEFAULT ||
      challengeTag === ""
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
      tag: challengeTag,
    };
    const res = await api.post("/challenge/create", challengeData);
    console.log("res", res);
    if (res.data.result === "success") {
      console.log("challengeData", challengeData);
      setChallengeTitle("");
      setChallengeDescription("");
      setChallengeCapacity(SELECT_DEFAULT);
      setChallengeFrequency(SELECT_DEFAULT);
      setChallengeTag("");
      alert("챌린지 생성에 성공하였습니다.");
      return;
    } else {
      console.log("challengeData", challengeData);
      setChallengeMessage("입력하지 않은 챌린지 정보가 있습니다.");
      return;
    }
  };

  return (
    <div className={styles.body} >
      <h1>새로운 챌린지 생성하기</h1>
      
      <label>
        <h4>챌린지 제목</h4>
      </label>
      <input
        type="text"
        placeholder="챌린지 이름을 입력해주세요"
        rows="3"
        size="30"
        value={challengeTitle}
        onChange={handleChallengeTitle}
      ></input>

      <label>
        <h4>챌린지 설명</h4>
      </label>
      <textarea
        placeholder="챌린지에 대한 간단한 설명을 입력해주세요"
        rows="5"
        cols="30"
        value={challengeDescription}
        onChange={handleChallengeDescription}
      ></textarea>

      <label>
        챌린지 최대 인원:
      </label>
        <select value={challengeCapacity} onChange={handleChallengeCapacity}>
          <option value={SELECT_DEFAULT}>선택</option>
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="6">6</option>
          <option value="8">8</option>
        </select>
      
      <label>
        챌린지 참여 빈도:
      </label>
        
        <select value={challengeFrequency} onChange={handleChallengeFrequency}>
          <option value={SELECT_DEFAULT}>선택</option>
          <option value="7">매일 참여</option>
          <option value="6">주 6회 참여</option>
          <option value="5">주 5회 참여</option>
          <option value="4">주 4회 참여</option>
          <option value="3">주 3회 참여</option>
          <option value="2">주 2회 참여</option>
          <option value="1">주 1회 참여</option>
        </select>

      <label>
        <h4>챌린지 태그</h4>
      </label>
      <input
        type="text"
        placeholder="챌린지 태그를 입력해주세요"
        rows="3"
        size="30"
        value={challengeTag}
        onChange={handleChallengeTag}
      ></input>
    
      <div style={{ color: "#cc3333" }}>{challengeMessage}</div>
      <div class="text-center">
        <button class="p-2 pl-5 pr-5 transition-colors duration-700 transform bg-indigo-500 hover:bg-blue-400 text-gray-100 text-lg rounded-lg focus:border-4 border-indigo-300" type="button" onClick={handleSubmit}>챌린지 생성</button>
      </div>
    </div>
    
  );
}
