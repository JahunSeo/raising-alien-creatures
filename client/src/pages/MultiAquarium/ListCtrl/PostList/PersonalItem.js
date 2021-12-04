import React from "react";
import "./PersonalItem.css";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../Redux/actions/index.js";
import { Link } from "react-router-dom";
import api from "../../../../apis/index";
import { S3URL } from "../../../../shared/lib/Constants";

const PostItem = React.memo(function PostItem({ alien, handleSelectAlien }) {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => ({
    userId: state.user.user.id,
  }));

  const onClickGraduate = async () => {
    let req = { alien_id: alien.id, challenge_id: alien.challenge_id};
    let res = await api.post("/alien/graduation", req);
    if (res.data.result === "success")
      dispatch(
        actions.setPopupModal(
          "GRADUATE_ALIEN",
          `${alien.alien_name} 졸업했습니다`,
          "SUCC",
          () => {
            dispatch(actions.graduate(alien.id));
          }
        )
      );
  };

  return (
    <>
      <div
        className="PostItemBlock"
        onClick={() => handleSelectAlien(alien.id)}
      >
        <h2>챌린지 : "{alien.challenge_name}"</h2>
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
            {/* <p>참가자 : {alien.user_nickname}</p> */}
            <p>별명 : {alien.alien_name}</p>
            <p>출생일 : {alien.created_date.split("T")[0]}</p>
            <p>인증 횟수 : {alien.accumulated_count}번</p>
          </div>
        </div>
        <div className="buttons">
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
          <Link to={`/challenge/${alien.challenge_id}/room`}>
            <button className="StyledButton">챌린지 어항</button>
          </Link>

          {alien.alien_status === 0 && 
            alien.user_info_id === userId && 
            <button className="StyledButton" onClick={onClickGraduate}>
              졸업 신청
            </button>
          }
        </div>
      </div>
    </>
  );
});

export default PostItem;
