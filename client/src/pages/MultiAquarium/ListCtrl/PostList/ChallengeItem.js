import React from "react";
import "./ChallengeItem.css";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../Redux/actions/index.js";
import { Link } from "react-router-dom";
import { S3URL } from "../../../../shared/lib/Constants";

const PostItem = React.memo(function PostItem({ alien, handleSelectAlien }) {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => ({
    userId: state.user.user.id,
  }));

  return (
    <>
      <div
        className="PostItemBlock"
        onClick={() => handleSelectAlien(alien.id)}
      >
        {/* <h2>"{alien.user_nickname}"의 {alien.alien_name}</h2> */}
        <div className="Content">
          <div
            className="images"
            style={{
              backgroundImage: `url("${
                S3URL + alien.image_url.split("-")[0]
              }")`,
            }}
          />
          <div className="SubInfo">
            <p>참가자 : {alien.user_nickname}</p>
            <p>별명 : {alien.alien_name}</p>
            {/* <p>출생일 : {alien.created_date.split("T")[0]}</p> */}
            <p>인증 횟수 : {alien.accumulated_count}번</p>
          <Link to={`/user/${alien.user_info_id}/room`}>
            <button className="StyledButton">참가자 어항</button>
          </Link>
          {alien.alien_status === 0 && 
            alien.user_info_id === userId && 
            <button
              className="StyledButton"
              onClick={() => {
                // TODO: 통합하기
                dispatch(actions.selectAlien(alien.id));
                dispatch(actions.showAuthRequest(true));
              }}
            >
              인증하기
            </button>
          }
          </div>
        </div>
        <div className="buttons">

        </div>
      </div>
    </>
  );
});

export default PostItem;
