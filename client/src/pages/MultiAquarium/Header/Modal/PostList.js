import React, { useCallback, useState } from "react";
import "./PostList.css";

const PostItem = React.memo(function PostItem({ fish }) {
  return (
    <>
      <div className="PostItemBlock">
        <h2>챌린지 : "{fish.challenge}"</h2>
        <div className="Content">
          <img alt="logo192.png" src="logo192.png" />
          <div className="SubInfo">
            <p>이름 : {fish.alienName}</p>
            <p>출생년도 : {fish.createDate}</p>
            <p>Commit 횟수 : {fish.accuredAuthCnt}번</p>
          </div>
        </div>
        <div className="buttons">
          <button className="StyledButton"> 인증하기</button>
          <button className="StyledButton"> 챌린지 어항</button>
          <button className="StyledButton"> 졸업 신청</button>
        </div>
      </div>
    </>
  );
});

const PostList = () => {
  function createFish() {
    const array = [];
    for (let i = 0; i < 15; i++) {
      array.push({
        id: i,
        challenge: `여친한테 전화하기`,
        nCommit: 30,
        user_info_id: 1,
        Challenge_id: 1,
        createDate: `1996.11.18`,
        isAlive: 1,
        alienName: `개복치${i}`,
        Alien_image_url: "image_url_1",
        accuredAuthCnt: 26,
        failureCnt: 0,
        life: 0,
        graduate: i % 2,
      });
    }
    return array;
  }
  const [myFishList] = useState(createFish);
  const [category, setCategory] = useState(false);
  const [drop, setDrop] = useState(false);

  const grad_onClick = useCallback(e => {
    // submit event는 브라우저에서 새로고침을 발생시키기 때문에 preventDefault는 이걸 방지하는 함수
    e.preventDefault();
    setCategory(category => !category);
    }, []
  )

  const drop_onClick = useCallback(e => {
    e.preventDefault();
    setDrop(drop => !drop)
    }, []
  );

  return (
    <div className="PostListBlock">
      <button className ='dropdown' onClick= {drop_onClick}>
        <img style={{width: '1.7em', height: '1.7em' }} alt = "toggledown.png" src="toggledown.png"/>
      </button>
      {
        drop ?
      (<div className = 'dropContent'>
          <span> 추가된 날짜 (최신 순) </span>
          <span> 추가된 날짜 (오래된 순) </span>
          <span> 커밋 횟수(가장 많은 순) </span>
          <span> 커밋 횟수(가장 낮은 순) </span>
        </div>)
        : null
        }
      <ul>
        <span
          className={category === false ? "selected" : null} onClick={grad_onClick} >∘ 진행중 </span>
        <span
          className={category === true ? "selected" : null} onClick={grad_onClick} >∘ 졸업 </span>
      </ul>
      {myFishList.map((Fish) =>
        Boolean(Fish.graduate) === category ? (
          <PostItem key={Fish.id} fish={Fish} />
        ) : null
      )}
    </div>
  );
};

export default PostList;
