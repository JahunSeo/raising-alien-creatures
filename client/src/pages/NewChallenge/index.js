import React, { useState } from "react";
import api from "../../apis/index.js";
import ReactSlider from "react-slider"
import { useNavigate } from "react-router";

export default function NewAlien(props) {
  // TODO: login 상태일 때만 접근할 수 있음
  // TODO: 챌린지에 접근 가능한 유저인지 확인해주어야 함
  const SELECT_DEFAULT = 0;
  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [challengeCapacity, setValue] = useState(0);
  const [challengeFrequency, setChallengeFrequency] = useState(SELECT_DEFAULT);
  const [challengeTag, setChallengeTag] = useState(SELECT_DEFAULT);
  const [challengeMessage, setChallengeMessage] = useState(null);
  

  function handleChallengeTitle(e) {
    setChallengeTitle(e.target.value);
  }

  function handleChallengeDescription(e) {
    setChallengeDescription(e.target.value);
  }

  function handleChallengeCapacity(challengeCapacity) {
    setValue(challengeCapacity)
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
        challengeFrequency,
        challengeTag,
      )
    )
      return;
    
    setChallengeMessage(null);
    postChallenge();
  };
  const navigate = useNavigate()
  const handleCancel = () => {
    // 홈으로 이동
    navigate('/');
    return;
  }

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
      challengeCapacity === 0 ||
      challengeFrequency === SELECT_DEFAULT ||
      challengeTag === SELECT_DEFAULT
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
    // const navigate = useNavigate();

    if (res.data.result === "success") {
      console.log("challengeData", challengeData);
      console.log(res.data.data);
      const challengeId = res.data.data.challenge_id;

      setChallengeTitle("");
      setChallengeDescription("");
      setChallengeFrequency(SELECT_DEFAULT);
      setChallengeTag(SELECT_DEFAULT);
      setValue(0);
      //alert보다는 모달창으로 문구와 챌린지로 이동 버튼 있으면 좋을 듯..
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
    <div class="flex justify-center items-center w-full h-full p-10">
    <div class="w-1/2 h-full bg-white rounded shadow-2xl p-8 m-4">
        <h1 class="block w-full text-center text-gray-800 text-2xl font-bold mb-6">새로운 챌린지 생성</h1>
            <div class="flex flex-col mb-4 p-4">
                <label class="mb-2 font-bold text-lg text-gray-900" for="challenge_name">챌린지 이름</label>
                <input class="border py-2 px-3 text-grey-800" type="text" name="challenge_name" id="challenge_name" value={challengeTitle} onChange={handleChallengeTitle}/>
            </div>

            <div class="main flex border rounded-full overflow-hidden m-4 select-none ">
              <div class="title py-5 my-auto px-3 bg-indigo-500 text-white text-sm font-semibold mr-3">Category</div>
              <select class="border py-2 px-4 text-grey-800" value={challengeTag} onChange={handleChallengeTag}>
                <option value={SELECT_DEFAULT}>선택</option>
                <option value="운동">운동</option>
                <option value="실생활">실생활</option>
                <option value="독서">독서</option>
                <option value="공부">공부</option>
                <option value="기타">기타</option>
              </select>
            </div>
            
            <div class="flex flex-col mb-4 p-3">
                <label class="mb-2 font-bold text-lg text-gray-900" for="textarea">챌린지 설명</label>
                <textarea class="border py-2 px-3 text-grey-800" name="textarea" id="textarea" rows="4" value={challengeDescription} onChange={handleChallengeDescription}></textarea>
            </div>

            <div class="flex flex-col mb-4 p-3">
              <label class="mb-2 font-bold text-lg text-gray-900">최대 참여 인원</label>
              <ReactSlider
                step={5}
                min={0}
                max={100}
                className="w-full h-3 pr-2 my-4 bg-gray-200 rounded-md cursor-grab"
                thumbClassName="absolute w-7 h-7 cursor-grab bg-indigo-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 -top-2px"
                value={challengeCapacity}
					      onChange={handleChallengeCapacity}
                />
                <span>{challengeCapacity}명</span>
            </div>

            
            <div class="flex flex-col mb-4 p-3">
                <label class="mb-2 font-bold text-lg text-gray-900" for="Select">주 몇회?</label>
                <select class="border py-2 px-3 text-grey-800" value={challengeFrequency} onChange={handleChallengeFrequency}>
                <option value={SELECT_DEFAULT}>선택</option>
                <option value="7">매일 참여</option>
                <option value="6">주 6회 참여</option>
                <option value="5">주 5회 참여</option>
                <option value="4">주 4회 참여</option>
                <option value="3">주 3회 참여</option>
                <option value="2">주 2회 참여</option>
                <option value="1">주 1회 참여</option>
                </select>
            </div>

            <div style={{ color: "#cc3333" }} >{challengeMessage}</div>
            <button class="p-2 pl-5 pr-5 transition-colors duration-700 transform bg-indigo-500 hover:bg-blue-400 text-gray-100 text-lg rounded-lg focus:border-4 border-indigo-300" type="button" onClick={handleSubmit}>챌린지 생성</button>
            <button class="mx-5 p-2 pl-5 pr-5 transition-colors duration-700 transform bg-gray-200 hover:bg-blue-400 text-black-100 text-lg rounded-lg focus:border-4 border-indigo-300" type="button" onClick={handleCancel}>취소</button>
            
    </div>
</div>
  );
}
