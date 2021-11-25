import React, { useState } from "react";

import { Link } from "react-router-dom";
import api from "../../../../apis";

import searchIcon from "../../../../image/search-icon.png";
import backIcon from "../../../../image/goback-icon.png";
import tigerIcon from "../../../../image/무케.jpg";

import styles from "./index.module.css";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

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
    <div className={cx("SearchBox", { longer })}>
      {longer && (
        <img
          className={styles.backBtn}
          onClick={backClick}
          alt="뒤로가기"
          src={backIcon}
        ></img>
      )}
      <Link to={`/challenge/new`} className={styles.newChalBtn}>
        <button>{"새로운 챌린지 생성"}</button>
      </Link>
      <div className={styles.header}>
        <form className={styles.searchForm} onSubmit={onSubmit}>
          <div className={styles.double}>
            <input
              id="input"
              placeholder=" "
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              autoComplete="off"
            />
            <label htmlFor="input">어떤 챌린지를 찾으세요?</label>
            <img
              className={styles.searchBtn}
              onClick={onSubmit}
              alt="searchBtn"
              src={searchIcon}
            ></img>
            {message && <p className={styles.errMsg}>{message}</p>}
          </div>
        </form>
      </div>
      {longer && (
        <div className={styles.findChallenge}>
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
  return (
    <div className={cx("challengeItem")}>
      <div className={styles.challengeName}>{challenge.challengeName}</div>
      <img className={styles.challengeImg} alt="yammy" src={tigerIcon} />
      <div className={styles.participant}>
        참여인원: {challenge.participantNumber}/{challenge.maxUserNumber}명
      </div>
      <div className={styles.participant}>
        주 인증횟수: {challenge.cntOfWeek}번
      </div>
      <div className={styles.createDate}>
        생성일: {challenge.createDate.split("T")[0]}
      </div>
      <div className={styles.createUser}>
        생성원: {challenge.createUserNickName}
      </div>
      <div className={styles.Details}>{challenge.challengeContent}</div>
      <Link to={`/challenge/${challenge.id}/room`}>
        <button className={styles.challengeButton}>챌린지 방 가기</button>
      </Link>
    </div>
  );
};
