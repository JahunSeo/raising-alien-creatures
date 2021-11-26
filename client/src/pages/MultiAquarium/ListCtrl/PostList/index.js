import React, { useCallback, useEffect, useState } from "react";
import "./PostList.css";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../Redux/actions/index.js";
import SideBarModal2 from "../SideBarModal2";
import { Link } from "react-router-dom";
import api from '../../../../apis/index'
import HamburgerBtnImage from "../../../../image/toggledown.png";
import { S3URL } from "../../../../shared/lib/Constants";

const PostItem = React.memo(function PostItem({ alien, type, selectedAlien }) {
  const dispatch = useDispatch();
  const {userId, showModal2} = useSelector((state) => ({
    userId : state.user.user.id,
    showModal2 : state.modalOnOff.showModal2,
  }));
  

  const onClickGraduate = async() =>{
    let req = { alien_id: alien.id };
    let res = await api.post("/alien/graduation", req);
    console.log(res);
  }

  console.log(userId)
  return (
    <>
      <div className="PostItemBlock">
        <h2>챌린지 : "{alien.challengeName}"</h2>
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
              {alien.create_date.split("T")[0]}
            </p>
            <p>Commit 횟수 : {alien.accured_auth_cnt}번</p>
          </div>
        </div>
        <div className="buttons">
          {type !== "main" && (
            <button
              className="StyledButton"
              onClick={() => {
                dispatch(actions.alienAuth({ alien }));
                dispatch(actions.showModal2(!showModal2));
              }}
            >
              인증하기
            </button>
          )}
          <SideBarModal2 alien={alien} />
          {type !== "challenge" && (
            <Link to={`/challenge/${alien.Challenge_id}/room`}>
              <button className="StyledButton"> 챌린지 어항</button>
            </Link>
          )}
          {type !== "main" && alien.status === 0 && alien.user_info_id === userId && (
            <button className="StyledButton" onClick = {onClickGraduate}> 졸업 신청</button>
          )}
        </div>
      </div>
    </>
  );
});

const PostList = React.memo(function PostList({ type }) {
  const { aliens_list, selectedAlien } = useSelector(({ room }) => ({
    aliens_list: room.aliens,
    selectedAlien: room.selectedAlien,
  }));
  const {userId} = useSelector(({user}) => ({
    userId : user.user,
  }));

  const [category, setCategory] = useState(false);
  const [drop, setDrop] = useState(false);
  const [sort, setSort] = useState("a");

  // functions for sort
  const recentCreate = useCallback((a,b) =>{
    return new Date(b.create_date).getTime() - new Date(a.create_date).getTime();
  },  [],)
  const leastRecentCreate = (a,b) =>{
    return new Date(a.create_date).getTime() - new Date(b.create_date).getTime();
  }
  const mostCommit = (a,b) =>{
    return b.accured_auth_cnt - a.accured_auth_cnt;
  }
  const leastCommit = (a,b) =>{
    return a.accured_auth_cnt - b.accured_auth_cnt;
  }

  // console.log(userId)

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
          <option onClick={() => setSort("d")}> 커밋 횟수(가장 낮은 순) </option>
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
          .sort((a, b) =>
            {
              if (sort ==='a') return recentCreate(a,b);
              else if (sort === 'b') return leastRecentCreate(a,b);
              else if (sort === 'c') return mostCommit(a,b);
              else return leastCommit(a,b);
            }
          )
          .map((alien) =>
            Boolean(alien.status) === category ? (
              <PostItem
                key={alien.id}
                alien={alien}
                type={type}
                userId = {userId}
                selectedAlien={selectedAlien}
              />
            ) : null
          )
        }
    </div>
  );
});

export default PostList;
