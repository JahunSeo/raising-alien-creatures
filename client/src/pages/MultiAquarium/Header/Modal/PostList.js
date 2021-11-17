import React, { useCallback, useState } from "react";
import "./PostList.css";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../Redux/actions/index.js";
import SideBarModal2 from "./SideBarModal2";

const PostItem = React.memo(function PostItem({ alien }) {
  const dispatch = useDispatch();
  const showModal2 = useSelector((state) => state.modalOnOff.showModal2);

  console.log(alien);
  // console.log(alien.createDate.split('T')[0])
  return (
    <>
      <div className="PostItemBlock">
        <h2>챌린지 : "{alien.challengeName}"</h2>
        <div className="Content">
          <img alt="logo192.png" src="logo192.png" />
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
          <button
            className="StyledButton"
            onClick={() => {
              dispatch(actions.showModal2(!showModal2));
            }}
          >
            {" "}
            인증하기
          </button>
          <button className="StyledButton"> 챌린지 어항</button>
          <button className="StyledButton"> 졸업 신청</button>
          <SideBarModal2 alien={alien} />
        </div>
      </div>
    </>
  );
});

const PostList = () => {
  const { aliens_list } = useSelector(({ room }) => ({
    aliens_list: room.aliens,
  }));
  const [category, setCategory] = useState(false);
  const [drop, setDrop] = useState(false);

  const grad_onClick = useCallback((e) => {
    // submit event는 브라우저에서 새로고침을 발생시키기 때문에 preventDefault는 이걸 방지하는 함수
    e.preventDefault();
    setCategory((category) => !category);
  }, []);

  const drop_onClick = useCallback((e) => {
    e.preventDefault();
    setDrop((drop) => !drop);
  }, []);

  return (
    <div className="PostListBlock">
      <button className="dropdown" onClick={drop_onClick}>
        <img
          style={{ width: "1.7em", height: "1.7em" }}
          alt="toggledown.png"
          src="toggledown.png"
        />
      </button>
      {drop ? (
        <div className="dropContent">
          <span> 추가된 날짜 (최신 순) </span>
          <span> 추가된 날짜 (오래된 순) </span>
          <span> 커밋 횟수(가장 많은 순) </span>
          <span> 커밋 횟수(가장 낮은 순) </span>
        </div>
      ) : null}
      <ul>
        <span
          className={category === false ? "selected" : null}
          onClick={grad_onClick}
        >
          ∘ 진행중{" "}
        </span>
        <span
          className={category === true ? "selected" : null}
          onClick={grad_onClick}
        >
          ∘ 졸업{" "}
        </span>
      </ul>
      {aliens_list.map((alien) =>
        Boolean(alien.graduate_toggle) === category ? (
          // alien.id unique한걸로 back이랑 얘기하기
          <PostItem key={alien.id} alien={alien} />
        ) : null
      )}
    </div>
  );
};

export default PostList;
