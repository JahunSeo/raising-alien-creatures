import React, { useCallback, useState } from "react";
import "./PostList.css";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../../Redux/actions/index.js";
import { Link } from "react-router-dom";
import api from "../../../../apis/index";
import { S3URL } from "../../../../shared/lib/Constants";
import classNames from "classnames/bind";
const cx = classNames.bind();

const PostItem = React.memo(function PostItem({
  alien,
  type,
  selectedAlien,
  handleSelectAlien,
}) {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => ({
    userId: state.user.user.id,
  }));

  const onClickGraduate = async () => {
    let req = { alien_id: alien.id };
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
            {type === "challenge" && <p>참가자 : {alien.user_nickname}</p>}
            <p>별명 : {alien.alien_name}</p>
            <p>출생일 : {alien.created_date.split("T")[0]}</p>
            <p>인증 횟수 : {alien.accumulated_count}번</p>
          </div>
        </div>
        <div className="buttons">
          {/* // TODO: 인증 가능 여부에 맞게 버튼 처리하기!  */}
          {type === "personal" &&
            alien.alien_status === 0 &&
            alien.user_info_id === userId && (
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
            )}
          {type !== "challenge" && alien.alien_status === 0 && (
            <Link to={`/challenge/${alien.challenge_id}/room`}>
              <button className="StyledButton">챌린지 어항</button>
            </Link>
          )}
          {type === "challenge" && (
            <Link to={`/user/${alien.user_info_id}/room`}>
              <button className="StyledButton">참가자 어항</button>
            </Link>
          )}
          {type === "personal" &&
            alien.alien_status === 0 &&
            alien.user_info_id === userId && (
              <button className="StyledButton" onClick={onClickGraduate}>
                졸업 신청
              </button>
            )}
        </div>
      </div>
    </>
  );
});

function PostList({ type, handleSelectAlien }) {
  const { aliens_list, selectedAlien } = useSelector(({ room }) => ({
    aliens_list: room.aliens,
    selectedAlien: room.selectedAlien,
  }));
  const { userId } = useSelector(({ user }) => ({
    userId: user.user,
  }));

  const [category, setCategory] = useState(false);
  const [sort, setSort] = useState("a");
  const [isMenuOn, setIsMenuOn] = useState(false);

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

  const sortClick = (e) => {
    setSort(e.target.value);
    setIsMenuOn(false);
  };

  return (
    <div className="PostListBlock">
      <ToggleBtn isMenuOn={isMenuOn} setIsMenuOn={setIsMenuOn} />
      {isMenuOn ? (
        <div className="dropContent">
          <option value="a" onClick={sortClick}>
            {" "}
            추가된 날짜 (최신 순)
          </option>
          <option value="b" onClick={sortClick}>
            {" "}
            추가된 날짜 (오래된 순)
          </option>
          <option value="c" onClick={sortClick}>
            {" "}
            커밋 횟수(가장 많은 순)
          </option>
          <option value="d" onClick={sortClick}>
            {" "}
            커밋 횟수(가장 낮은 순)
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
              handleSelectAlien={handleSelectAlien}
            />
          ) : null
        )}
    </div>
  );
}

export default PostList;

function ToggleBtn(props) {
  const { isMenuOn, setIsMenuOn } = props;
  return (
    <nav className="toggleBtn">
      <button
        className="text-gray-500 w-10 h-10 relative focus:outline-none bg-transparent"
        onClick={() => setIsMenuOn(!isMenuOn)}
      >
        <div className="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span
            aria-hidden="true"
            className={cx(
              "block absolute h-0.5 w-5 bg-white transform transition duration-500 ease-in-out",
              isMenuOn ? "" : "-translate-y-1.5"
            )}
          ></span>
          <span
            aria-hidden="true"
            className={cx(
              "block absolute h-0.5 w-5 bg-white transform transition duration-500 ease-in-out",
              isMenuOn ? "" : ""
            )}
          ></span>
          <span
            aria-hidden="true"
            className={cx(
              "block absolute h-0.5 w-5 bg-white transform transition duration-500 ease-in-out",
              isMenuOn ? "" : "translate-y-1.5"
            )}
          ></span>
        </div>
      </button>
    </nav>
  );
}
