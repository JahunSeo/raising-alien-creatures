import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import ReactSlider from "react-slider";
import api from "../../apis/index.js";
import "./index.module.css";
import "./NewChallenge.css";
import * as actions from "../../Redux/actions";

export default function NewChallenge(props) {
  // TODO: login 상태일 때만 접근할 수 있음
  // TODO: 챌린지에 접근 가능한 유저인지 확인해주어야 함

  const dispatch = useDispatch();

  const SELECT_DEFAULT = 0;
  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [challengeCapacity, setChallengeCapacity] = useState(SELECT_DEFAULT);
  const [challengeFrequency, setChallengeFrequency] = useState(SELECT_DEFAULT);
  const [challengeCategory, setChallengeCategory] = useState(SELECT_DEFAULT);
  const [challengeMessage, setChallengeMessage] = useState(null);
  const [challengeImage, setChallengeImage] = useState(null);
  const [challengeClicked, setChallengeClicked] = useState(false);

  function handleImage(e) {
    setChallengeImage(e.target.files);
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (challengeClicked) return;

    if (
      !validateChallenge(
        challengeTitle,
        challengeDescription,
        challengeCapacity,
        challengeFrequency,
        challengeCategory,
        challengeImage
      )
    )
      return;

    setChallengeMessage(null);
    setChallengeClicked(true);
    // post the image direclty to the s3 bucket
    if (challengeImage) {
      const res = await api.get("/main/s3Url");
      const { url } = res.data;
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: challengeImage[0],
      });
      const imageUrl = url.split("?")[0];

      postChallenge(imageUrl);
    } else {
      postChallenge();
    }
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

  const postChallenge = async (imageUrl) => {
    let challengeData = {
      challenge_name: challengeTitle,
      challenge_content: challengeDescription,
      max_user: challengeCapacity,
      cnt_of_week: challengeFrequency,
      tag: challengeCategory,
      image_url: imageUrl,
    };

    const res = await api.post("/challenge/create", challengeData);
    console.log("res", res);

    if (res.data.result === "success") {
      console.log("challengeData", challengeData);
      console.log("res", res.data.data);
      const challengeId = res.data.data.challenge_id;
      setChallengeClicked(false);
      // 고민: 방장이 챌린지 생성 후 생명체를 만들지 않고 나가버리면 추후에 어떻게 챌린지방을 찾을 수 있는가?
      // alert("챌린지 생성에 성공하였습니다.");
      dispatch(
        actions.setPopupModal(
          "CREATE_CHALLENGE",
          "챌린지가 생성되었습니다 !",
          "SUCC",
          () => {
            navigate(`/challenge/${challengeId}/room`);
          }
        )
      );
      return;
    } else {
      console.log("challengeData", challengeData);
      setChallengeMessage("입력하지 않은 챌린지 정보가 있습니다.");
      setChallengeClicked(false);
      return;
    }
  };

  // console.log("challengeClicked", challengeClicked);

  return (
    <div className="flex h-screen w-full justify-center items-center bg-gradient-to-r from-indigo-900 via-gray-700 to-purple-900 hover:from-purple-900 hover:via-gray-500 hover:to-indigo-900">
      <div className="min-w-max h-2/3 md:min-h-2/3 w-1/2 rounded-xl bg-gray-100 shadow-2xl overflow-y-auto p-4  md:p-8">
        <h1 className="block w-full text-center md:text-2xl text-lg font-bold mb-6">
          새로운 챌린지 생성
        </h1>
        <div className="text-sm md:text-lg ">
          <div className="flex flex-col p-3">
            <label className="mb-2 font-bold">챌린지 이름</label>
            <input
              className="border rounded-xl py-2 px-3"
              type="text"
              name="challenge_name"
              id="challenge_name"
              value={challengeTitle}
              onChange={handleTitle}
            />
          </div>

          <div className="flex flex-col min-w-max relative p-3">
            <label className="mb-1 font-bold">챌린지 카테고리</label>
            <select
              className="text-sm md:text-lg border rounded-xl pl-5 bg-white hover:border-gray-400 focus:outline-none appearance-none"
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

          <div className="flex flex-col p-3">
            <label className="mb-1 font-bold ">챌린지 설명</label>
            <textarea
              className="border rounded-xl py-2 "
              rows="2"
              value={challengeDescription}
              onChange={handleDescription}
            ></textarea>
          </div>

          <div className="flex flex-col p-3">
            <label className=" font-bold ">최대 참여 인원</label>
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

          <div className="flex flex-col p-3">
            <label className="mb-2 rounded-xl font-bold">
              챌린지 참여 빈도
            </label>
            <select
              className="text-sm md:text-lg border rounded-xl"
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

          <div className="flex flex-col min-h-0 min-w-max p-3">
            <label className="text-lg font-bold mb-2">챌린지 이미지</label>
            <div className="Attachments">
              <div className="flex flex-col absolute min-h-0 min-w-max items-center">
                <span className="block text-gray-400 font-normal">
                  챌린지를 간단하게 표현하는 이미지를 첨부해주세요.
                </span>
              </div>
              <input
                type="file"
                className="h-full w-full m-auto opacity-0"
                accept="image/*"
                onChange={handleImage}
              />
            </div>
          </div>

          <div className="flex-col min-w-max justify-center items-center px-3">
            <div className="text-center text-red-600 animate-pulse">
              <h1>{challengeMessage}</h1>
              <br />
            </div>
            <div className="flex justify-center">
              <button
                className="p-2 pl-3 pr-3 transition-colors duration-700 transform bg-indigo-500 hover:bg-blue-500 text-gray-100 rounded-lg focus:border-4 border-indigo-300"
                type="button"
                onClick={handleSubmit}
              >
                챌린지 생성
              </button>
              <button
                className="mx-5 pl-5 pr-5 transition-colors duration-700 transform bg-gray-300 hover:bg-gray-400 text-black-100 rounded-lg focus:border-4 border-indigo-300"
                type="button"
                onClick={handleCancel}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
