import React, { useCallback, useState } from "react";

import { Link } from "react-router-dom";
import api from "../../../apis";

import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../Redux/actions";

import searchIcon from "../../../image/search-icon.png";
import backIcon from "../../../image/goback-icon.png";

import styles from "./index.module.css";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function SearchBox(props) {
  const [longer, setLonger] = useState(false);
  const [challengeList, setChallengeList] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [message, setMessage] = useState("");
  const tags = ["전체", "건강", "운동", "공부", "독서", "취미"];

  const dispatch = useDispatch();

  const { user } = useSelector(({ user }) => ({ user: user.user }));
  const showSignInModal = useSelector(
    (state) => state.modalOnOff.showSignInModal
  );

  const switchSignInModal = () => {
    dispatch(actions.showSignUpModal(false));
    dispatch(actions.showSignInModal(!showSignInModal));
  };

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

  const clickTag = useCallback(async (tag) => {
    setSearchKeyword(tag);
    let keyword = { category: tag };
    let res = await api.post("/challenge/searchCategory", keyword);
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
  }, []);

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
      {user.login ? (
        <Link to={`/challenge/new`}>
          <button className={styles.newChalBtn}>{"새로운 챌린지 생성"}</button>
        </Link>
      ) : (
        <button
          className={styles.newChalBtn}
          onClick={() => switchSignInModal()}
        >
          {"새로운 챌린지 생성"}
        </button>
      )}
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
        <div className={styles.tags}>
          {tags.map((tag) => (
            <div key={tag} className={styles.tag} onClick={() => clickTag(tag)}>
              #{tag}
            </div>
          ))}
        </div>
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
      <div className={styles.challengeName}>{challenge.challenge_name}</div>
      <img
        className={styles.challengeImg}
        alt="yammy"
        src={challenge.img_url}
      />
      <div className={styles.participant}>
        참여인원: {challenge.participant_number}/{challenge.maximum_number}명
      </div>
      <div className={styles.participant}>
        주 인증횟수: {challenge.times_per_week}번
      </div>
      <div className={styles.createDate}>
        생성일: {challenge.created_date.split("T")[0]}
      </div>
      <div className={styles.createUser}>생성원: {challenge.created_by}</div>
      <div className={styles.Details}>{challenge.description}</div>
      <Link to={`/challenge/${challenge.id}/room`}>
        <button className={styles.challengeButton}>챌린지 방 가기</button>
      </Link>
    </div>
  );
};
