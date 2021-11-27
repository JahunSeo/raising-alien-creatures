import React, { useCallback, useEffect, useState } from "react";
import "./PostList.css";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../Redux/actions/index.js";
import { Link } from "react-router-dom";
import api from "../../../../apis/index";
import { S3URL } from "../../../../shared/lib/Constants";
// import AuthRequestModal from "../../ListCtrl/AuthRequestModal";
import HamburgerBtnImage from "../../../../image/toggledown.png";

const PostItem = React.memo(function PostItem({ alien, type, selectedAlien }) {
  const dispatch = useDispatch();
  const { userId, showAuthRequest } = useSelector((state) => ({
    userId: state.user.user.id,
    // showAuthRequest: state.modalOnOff.showAuthRequest,
  }));

  const onClickGraduate = async () => {
    let req = { alien_id: alien.id };
    let res = await api.post("/alien/graduation", req);
    if (res.data.result === "success") dispatch(actions.graduate(alien.id));
  };

  return (
    <>
      <div className="PostItemBlock">
        <h2>챌린지 : "{alien.challenge_name}"</h2>
        <div className="Content">
          <img
            alt="물고기"
            src={S3URL + alien.image_url.split("-")[0]}
            onClick={() => {
              if (selectedAlien === alien.id) {
                dispatch(actions.selectAlien(null));
              } else {
                dispatch(actions.selectAlien(alien.id));
              }
            }}
          />
          <div className="SubInfo">
            <p>이름 : {alien.alien_name}</p>
            <p>
              출생년도 : <br />
              {alien.created_date.split("T")[0]}
            </p>
            <p>Commit 횟수 : {alien.accumulated_count}번</p>
          </div>
        </div>
        <div className="buttons">
          {type === "personal" &&
            alien.alien_status === 0 &&
            alien.user_info_id === userId && (
              <button
                className="StyledButton"
                onClick={() => {
                  dispatch(actions.alienAuth({ alien }));
                  // dispatch(actions.showAuthRequest(!showAuthRequest));
                }}
              >
                인증하기
              </button>
            )}
          {/* <AuthRequestModal alien={alien} /> */}
          {type !== "challenge" && alien.alien_status === 0 && (
            <Link to={`/challenge/${alien.challenge_id}/room`}>
              <button className="StyledButton"> 챌린지 어항</button>
            </Link>
          )}
          {type === "personal" &&
            alien.alien_status === 0 &&
            alien.user_info_id === userId && (
              <button className="StyledButton" onClick={onClickGraduate}>
                {" "}
                졸업 신청
              </button>
            )}
        </div>
      </div>
    </>
  );
});

const PostList = React.memo(function PostList({ type }) {
  console.log();
  const { aliens_list, selectedAlien } = useSelector(({ room }) => ({
    aliens_list: room.aliens,
    selectedAlien: room.selectedAlien,
  }));
  const { userId } = useSelector(({ user }) => ({
    userId: user.user,
  }));

  const [category, setCategory] = useState(false);
  const [drop, setDrop] = useState(false);
  const [sort, setSort] = useState("a");

  // functions for sort
  const recentCreate = useCallback((a, b) => {
    return (
      new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
    );
  }, []);
  const leastRecentCreate = (a, b) => {
    return (
      new Date(a.created_date).getTime() - new Date(b.created_date).getTime()
    );
  };
  const mostCommit = (a, b) => {
    return b.accumulated_count - a.accumulated_count;
  };
  const leastCommit = (a, b) => {
    return a.accumulated_count - b.accumulated_count;
  };

  return (
    <div className="PostListBlock">
      <button className="dropdown" onClick={() => setDrop((drop) => !drop)}>
        <img
          style={{ width: "1.7em", height: "1.7em" }}
          alt="toggledown.png"
          src={HamburgerBtnImage}
        />
      </button>
      {drop ? (
        <div className="dropContent">
          <option onClick={() => setSort("a")}> 추가된 날짜 (최신 순) </option>
          <option onClick={() => setSort("b")}> 추가된 날짜 (오래된 순)</option>
          <option onClick={() => setSort("c")}> 커밋 횟수(가장 많은 순)</option>
          <option onClick={() => setSort("d")}>
            {" "}
            커밋 횟수(가장 낮은 순){" "}
          </option>
        </div>
      ) : null}
      <ul>
        <span
          className={category === false ? "selected" : null}
          onClick={() => setCategory((category) => !category)}
        >
          ∘ 진행중
        </span>
        <span
          className={category === true ? "selected" : null}
          onClick={() => setCategory((category) => !category)}
        >
          ∘ 졸업
        </span>
      </ul>

      {aliens_list
        .sort((a, b) => {
          if (sort === "a") return recentCreate(a, b);
          else if (sort === "b") return leastRecentCreate(a, b);
          else if (sort === "c") return mostCommit(a, b);
          else return leastCommit(a, b);
        })
        .map((alien) =>
          Boolean(alien.alien_status) === category ? (
            <PostItem
              key={alien.id}
              alien={alien}
              type={type}
              userId={userId}
              selectedAlien={selectedAlien}
            />
          ) : null
        )}
    </div>
  );
});

export default PostList;
