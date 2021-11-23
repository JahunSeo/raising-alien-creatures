import React, { useState } from "react";

import { Link } from "react-router-dom";
import api from "../../../../apis";

import searchIcon from "../../image/search-icon.png";
import backIcon from "../../image/goback-icon.png";
import tigerIcon from "../../image/무케.jpg";
import cn from "classnames";
import "./SearchBox.css";

export default function SearchBox(props) {
  const [longer, setLonger] = useState(false);
  const [challengeList, setChallengeList] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [message, setMessage] = useState("");

  const backClick = () => {
    setLonger(false);
    setMessage("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    let keyword = { keyword: searchKeyword };
    let res = await api.post("/challenge/search", keyword);
    if (res.data.result !== "success") {
      console.log("안받아와짐");
      return;
    }
    if (res.data.result === "success") {
      if (res.data.challenge.length === 0) {
        setMessage("검색된 챌린지가 없습니다");
      } else {
        setChallengeList(res.data.challenge);
        setLonger(true);
        setMessage("");
      }
      return;
    }
  };

  return (
    <div className={cn("NormalBox", { longer })}>
      <div className="topBtnRow">
        {longer && (
          <img
            className="goback"
            onClick={backClick}
            alt="뒤로가기"
            src={backIcon}
          ></img>
        )}
        <Link to={`/challenge/new`}>
          <button className={"newChallenge"}>{"새로운 챌린지 생성"}</button>
        </Link>
      </div>
      <div className="header">
        <form className="searchForm" onSubmit={onSubmit}>
          <div className="double">
            <input
              id="input"
              placeholder=" "
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              autoComplete="off"
            />
            <label htmlFor="input">어떤 챌린지를 찾으시나요?</label>
            <img
              className="search"
              onClick={onSubmit}
              alt="search"
              src={searchIcon}
            ></img>
          </div>
        </form>
        {message && <div className="errmsg">{message}</div>}
      </div>
      {longer && (
        <div className="findChallenge">
          {challengeList.map((challenge) => (
            <ChallengeItem
              key={challenge.id}
              challenge={challenge}
            ></ChallengeItem>
          ))}
        </div>
      )}
    </div>
  );
}

const ChallengeItem = ({ challenge }) => {
  const [expand, setExpand] = useState(false);

  return (
    <div
      onClick={() => setExpand(!expand)}
      className={cn("challengeItem", { expand })}
    >
      <div className="challengeName">{challenge.challengeName}</div>
      <img className="challengeImg" alt="yammy" src={tigerIcon} />
      <div className="participant">
        참여인원: {challenge.participantNumber}/{challenge.maxUserNumber}명
      </div>
      <div className="participant"> 주 인증횟수: {challenge.cntOfWeek}번</div>
      {expand && (
        <>
          <div className="createDate">
            생성일: {challenge.createDate.split("T")[0]}
          </div>
          <div className="createUser">
            생성원: {challenge.createUserNickName}
          </div>
          <div className="Details">
            챌린지 설명: <br />
            {challenge.challengeContent}
          </div>
          <Link to={`/challenge/${challenge.id}/room`}>
            <button className="challengeButton">챌린지 방 가기</button>
          </Link>
        </>
      )}
    </div>
  );
};
