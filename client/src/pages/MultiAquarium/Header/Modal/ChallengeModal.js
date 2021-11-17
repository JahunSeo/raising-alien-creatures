import React, { useState } from "react";
import "./ChallengeModal.css";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../Redux/actions/index.js";
import api from "../../../../apis/index.js";

const ChallengeModal = ({ show, onHide, setChallengeModalOn }) => {
  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [challengeCapacity, setChallengeCapacity] = useState();
  const [challengeFrequency, setChallengeFrequency] = useState();

  const [challengeMessage, setChallengeMessage] = useState(null);

  const showModal1 = useSelector((state) => state.modalOnOff.showModal1);
  const dispatch = useDispatch();

  function handleCapacity(e) {
    e.preventDefault();
    setChallengeCapacity(e.target.value);
    console.log("challengeCapacity", challengeCapacity);
  }

  function handleFrequency(e) {
    e.preventDefault();
    setChallengeFrequency(e.target.value);
    console.log("challengeFrequency", challengeFrequency);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    postChallenge();
  };

  const postChallenge = async () => {
    let challengeData = {
      challenge_name: challengeTitle,
      challenge_content: challengeDescription,
      max_user: challengeCapacity,
      cnt_of_week: challengeFrequency,
    };
    const res = await api.post("/challenge/create", challengeData);
    console.log("res", res);
    if (res.data.result === "success") {
      alert("챌린지 생성에 성공하였습니다.");
      setChallengeTitle("");
      setChallengeDescription("");
      setChallengeCapacity(null);
      setChallengeFrequency(null);
      // dispatch(actions.showModal((current) => !current));
      return;
    } else {
      setChallengeMessage("챌린지 생성에 실패하였습니다.");
      return;
    }
  };

  return (
    <div>
      {/* <div
        className={showModal1 ? "Background" : null}
        onClick={() => {
          dispatch(actions.showModal((current) => !current));
        }}
      ></div> */}

      <div className={showModal1 ? "ModalContainer" : "hidden"}>
        <br />
        <h1>새로운 챌린지 생성하기</h1>
        <br />
        <label>
          <h4>챌린지 제목</h4>
        </label>
        <br />
        <br />
        <textarea
          placeholder="영어 단어 외우기"
          rows="2"
          onChange={(e) => {
            setChallengeTitle(e.target.value);
          }}
        ></textarea>
        <br />
        <br />
        <label>
          <h4>챌린지 설명</h4>
        </label>
        <br />
        <br />
        <textarea
          placeholder="매일 영어 단어를 30개씩 외우겠습니다."
          rows="3"
          onChange={(e) => {
            setChallengeDescription(e.target.value);
          }}
        ></textarea>
        <br />
        <br />
        <br />

        <form>
          <label>
            <h4>
              챌린지 참여 최대 인원:
              <select onChange={handleCapacity}>
                <option value="null">선택</option>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="8">8</option>
              </select>
            </h4>
          </label>
        </form>
        <br />
        <br />
        <form>
          <label>
            <h4>
              챌린지 참여 빈도:
              <select onChange={handleFrequency}>
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
              <div>{challengeMessage}</div>
              <br />
              <br />
              <button type="button" onClick={handleSubmit}>
                챌린지 생성
              </button>
            </h4>
          </label>
        </form>
        <br />
      </div>
    </div>
  );
};

export default ChallengeModal;
