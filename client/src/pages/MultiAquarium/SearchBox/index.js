import React, { useCallback, useState } from "react";

import { Link } from "react-router-dom";
import api from "../../../apis";

import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../Redux/actions";

import { HiOutlineSearch } from 'react-icons/hi'
import { GiSupersonicArrow } from "react-icons/gi";
import backIcon from "../../../image/goback-icon.png";
import mooke from "../../../image/무케.jpg";

import styles from "./index.module.css";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function SearchBox() {
  const [longer, setLonger] = useState(false);
  const [challengeList, setChallengeList] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [message, setMessage] = useState("");
  const tags = [
    {
      key: "전체", icon: require("../../../image/all.png").default,
    },
    {
      key: "건강", icon: require("../../../image/wellbeing.png").default,
    },
    {
      key: "운동", icon: require("../../../image/fitness.png").default,
    },
    {
      key: "공부", icon: require("../../../image/study.png").default,
    },
    {
      key: "독서", icon: require("../../../image/read.png").default,
    },
    {
      key: "취미", icon: require("../../../image/hobby.png").default,
    }
  ];

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

  let currentChallenges = user.challenges
    ? user.challenges.map((c) => c.id)
    : [];

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
            <HiOutlineSearch />
            {message && <p className={styles.errMsg}>{message}</p>}
          </div>
        </form>
        <div className={styles.tags}>
          {tags.map((tag) => (
            <div key={tag.key} className={styles.tag} onClick={() => clickTag(tag.key)}>
              <img alt='icons' src={tag.icon} />{tag.key}
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
              participating={currentChallenges.includes(challenge.id)}
            ></ChallengeItem>
          ))}
        </div>
      )}
    </div>
  );
}

const ChallengeItem = (props) => {
  const { challenge, participating } = props;
  return (
    <div className={cx("challengeItem")}>
      <div className={styles.challengeName}>
        {challenge.challenge_name} {participating && "(참가중)"}
      </div>
      <img
        className={styles.challengeImg}
        alt="yammy"
        src={challenge.img_url ? challenge.img_url : mooke}
      // src={mooke}
      />
      <div className={styles.participant}>
        참여인원: {challenge.participant_number}/{challenge.maximum_number}명{" "}
        <br />주 인증횟수: {challenge.times_per_week}번
      </div>
      <div>
        생성일: {challenge.created_date.split("T")[0]} <br />
        생성원: {challenge.user_nickname}
      </div>
      <div className={styles.Details}>
        <div>{challenge.description}</div>
      </div>
      <div className={styles.challengeButton}>
        <Link to={`/challenge/${challenge.id}/room`}>
          <button className={styles.challengeButton}> <GiSupersonicArrow style={{ marginRight: '5px' }} />챌린지 어항 가기</button>
        </Link>
      </div>
    </div>
  );
};
