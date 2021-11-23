import React, { useState } from "react";
import "./PostList.css";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../Redux/actions/index.js";
import SideBarModal2 from "../SideBarModal2";
import { Link } from "react-router-dom";
import DummyImage from "../../../../image/babyshark.png";
import HamburgerBtnImage from "../../../../image/toggledown.png";

const PostItem = React.memo(function PostItem({ alien, type, selectedAlien }) {
  const dispatch = useDispatch();
  // const showModal2 = useSelector((state) => state.modalOnOff.showModal2);

  return (
    <>
      <div className="PostItemBlock">
        <h2>챌린지 : "{alien.challengeName}"</h2>
        <div className="Content">
          <img
            alt="logo192.png"
            src={DummyImage}
            onClick={() => {
              if (selectedAlien === alien.id) {
                dispatch(actions.selectAlien(null));
              } else {
                dispatch(actions.selectAlien(alien.id));
              }
            }}
          />
          <div className="SubInfo">
            <p>이름 : {alien.alienName}</p>
            <p>
              출생년도 : <br />
              {alien.createDate.split("T")[0]}
            </p>
            <p>Commit 횟수 : {alien.accuredAuthCnt}번</p>
          </div>
        </div>
        <div className="buttons">
          {type !== "main" && (
            <button
              className="StyledButton"
              onClick={() => {
                dispatch(actions.alienAuth({ alien }));
                dispatch(actions.showModal2(true));
              }}
            >
              {" "}
              인증하기
            </button>
          )}
          <SideBarModal2 alien={alien} />
          {type !== "challenge" && (
            <Link to={`/challenge/${alien.Challenge_id}/room`}>
              <button className="StyledButton"> 챌린지 어항</button>
            </Link>
          )}
          {type !== "main" && (
            <button className="StyledButton"> 졸업 신청</button>
          )}
        </div>
      </div>
    </>
  );
});

const PostList = ({ type }) => {
  const { aliens_list, selectedAlien } = useSelector(({ room }) => ({
    aliens_list: room.aliens,
    selectedAlien: room.selectedAlien,
  }));

  const [category, setCategory] = useState(false);
  const [drop, setDrop] = useState(false);
  const [sort, setSort] = useState("a");

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
          <option onClick={() => setSort("b")}>
            {" "}
            추가된 날짜 (오래된 순){" "}
          </option>
          <option onClick={() => setSort("c")}>
            {" "}
            커밋 횟수(가장 많은 순){" "}
          </option>
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
          ∘ 진행중{" "}
        </span>
        <span
          className={category === true ? "selected" : null}
          onClick={() => setCategory((category) => !category)}
        >
          ∘ 졸업{" "}
        </span>
      </ul>
      {sort === "a" &&
        aliens_list
          .sort(
            (a, b) =>
              new Date(b.createDate).getTime() -
              new Date(a.createDate).getTime()
          )
          .map((alien) =>
            Boolean(alien.graduate_toggle) === category ? (
              <PostItem
                key={alien.id}
                alien={alien}
                type={type}
                selectedAlien={selectedAlien}
              />
            ) : null
          )}
      {sort === "b" &&
        aliens_list
          .sort(
            (a, b) =>
              new Date(a.createDate).getTime() -
              new Date(b.createDate).getTime()
          )
          .map((alien) =>
            Boolean(alien.graduate_toggle) === category ? (
              <PostItem
                key={alien.id}
                alien={alien}
                type={type}
                selectedAlien={selectedAlien}
              />
            ) : null
          )}
      {sort === "c" &&
        aliens_list
          .sort((a, b) => b.accuredAuthCnt - a.accuredAuthCnt)
          .map((alien) =>
            Boolean(alien.graduate_toggle) === category ? (
              <PostItem
                key={alien.id}
                alien={alien}
                type={type}
                selectedAlien={selectedAlien}
              />
            ) : null
          )}
      {sort === "d" &&
        aliens_list
          .sort((a, b) => a.accuredAuthCnt - b.accuredAuthCnt)
          .map((alien) =>
            Boolean(alien.graduate_toggle) === category ? (
              <PostItem
                key={alien.id}
                alien={alien}
                type={type}
                selectedAlien={selectedAlien}
              />
            ) : null
          )}
    </div>
  );
};

export default PostList;
