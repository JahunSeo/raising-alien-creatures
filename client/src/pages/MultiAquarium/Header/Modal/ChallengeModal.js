import React, { useState } from "react";
import "./ChallengeModal.css";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../Redux/actions/index.js";
import api from "../../../../apis/index.js";

const ChallengeModal = ({ show, onHide, setChallengeModalOn }) => {
  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [challengeCapacity, setChallengeCapacity] = useState(null);
  const [challengeFrequency, setChallengeFrequency] = useState(null);

  const [challengeMessage, setChallengeMessage] = useState(null);

  const showModal3 = useSelector((state) => state.modalOnOff.showModal3);
  const dispatch = useDispatch();

  function validateChallenge(challengeTitle, challengeDescription) {
    if (
      challengeTitle === "" ||
      challengeDescription === "" ||
      challengeCapacity === null ||
      challengeFrequency === null
    ) {
      setChallengeMessage("입력하지 않은 챌린지 정보가 있습니다.");
      return false;
    }

    setChallengeMessage(null);
    return true;
  }

  function handleCapacity(e) {
    setChallengeCapacity(e.target.value);
  }

  function handleFrequency(e) {
    setChallengeFrequency(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
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

  const postChallenge = async () => {
    let challengeData = {
      challenge_name: challengeTitle,
      challenge_content: challengeDescription,
      max_user: challengeCapacity,
      cnt_of_week: challengeFrequency,
      life: 1,
    };
    const res = await api.post("/challenge/create", challengeData);
    console.log("res", res);
    if (res.data.result === "success") {
      console.log("challengeData", challengeData);
      setChallengeTitle("");
      setChallengeDescription("");
      setChallengeCapacity("선택");
      setChallengeFrequency("선택");
      alert("챌린지 생성에 성공하였습니다.");
      dispatch(actions.showModal3(!showModal3));
      return;
    } else {
      setChallengeMessage("입력하지 않은 챌린지 정보가 있습니다.");
      return;
    }
  };

  return (
    <div>
      {/* <div
        className={showModal3 ? "Background" : null}
        onClick={() => {
          dispatch(actions.showModal3(false));
        }}
      /> */}
      <div className={showModal3 ? "ChallengeContainer" : "hidden"}>
        <br />
        <h1>새로운 챌린지 생성하기</h1>
        <br />
        <label>
          <h4>챌린지 제목</h4>
        </label>
        <br />
        <br />
        <input
          type="text"
          placeholder="영어 단어 외우기"
          rows="3"
          size="30"
          value={challengeTitle}
          onChange={(e) => {
            setChallengeTitle(e.target.value);
          }}
        ></input>
        <br />
        <br />
        <label>
          <h4>챌린지 설명</h4>
        </label>
        <br />
        <br />
        <textarea
          placeholder="매일 영어 단어를 30개씩 외우겠습니다."
          rows="5"
          cols="28"
          value={challengeDescription}
          onChange={(e) => {
            setChallengeDescription(e.target.value);
          }}
        ></textarea>
        <br />
        <br />
        <br />

        <div>
          <label>
            <h4>
              챌린지 최대 인원:
              <select value={challengeCapacity} onChange={handleCapacity}>
                <option value="null">선택</option>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="8">8</option>
              </select>
            </h4>
          </label>
        </div>
        <br />
        <br />
        <div>
          <label>
            <h4>
              챌린지 참여 빈도:
              <select value={challengeFrequency} onChange={handleFrequency}>
                <option value="null">선택</option>
                <option value="7">매일 참여</option>
                <option value="6">주 6회 참여</option>
                <option value="5">주 5회 참여</option>
                <option value="4">주 4회 참여</option>
                <option value="3">주 3회 참여</option>
                <option value="2">주 2회 참여</option>
                <option value="1">주 1회 참여</option>
              </select>
              <br />
              <br />
              <div style={{ color: "#cc3333" }}>{challengeMessage}</div>
              <br />
              <br />
              <div>
                <button type="button" onClick={handleSubmit}>
                  챌린지 생성
                </button>
              </div>
            </h4>
          </label>
        </div>
        <br />
      </div>
    </div>
  );
};

export default ChallengeModal;
