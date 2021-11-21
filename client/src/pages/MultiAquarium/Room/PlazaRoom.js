import React, { useState, useEffect } from "react";
import Room from "../../../shared/room/RoomClient";
import { useDispatch } from "react-redux";
import * as actions from "../../../Redux/actions";
import { Link } from "react-router-dom";
import api from "../../../apis";
import cn from "classnames";
import "./PlazaRoom.css";
import searchIcon from "../image/search-icon.png";
import backIcon from "../image/goback-icon.png";
import tigerIcon from "../image/무케.jpg";

export default function PlazaRoom(props) {
  const dispatch = useDispatch();

  // 챌린지 정보 가져오기
  const roomId = "plaza";
  const { rooms } = props;
  if (!rooms.current) rooms.current = {};
  if (!rooms.current[roomId]) rooms.current[roomId] = new Room(roomId);

  const [longer, setLonger] = useState(false);
  const [challengeList, setChallengeList] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await api.get("/main");
        console.log("fetch main data", res.data);
        if (res.data.result === "success") {
          // rooms 상태 정보
          console.log("plazaroom:", roomId);
          rooms.current[roomId].initMonsters(res.data.data);
          rooms.current[roomId].start();
          // TODO: redux
          dispatch(actions.setRoom({ roomId: roomId, aliens: res.data.data }));
        } else {
        }
      };
      fetchData();
    } catch (err) {
      console.error("fetchData fail", err);
    }
    return () => {
      rooms.current[roomId].close();
    };
    //   }, []);
  }, [rooms, roomId, dispatch]);

  const backClick = () => {
    setLonger(false);
    setMessage("");
    document.getElementById("input").value = "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    let keyword = { keyword: document.getElementById("input").value };
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

  return (
    <div className={cn("NormalBox", { longer })}>
      <div className="top">
        {longer && (
          <img
            className="goback"
            onClick={backClick}
            alt="뒤로가기"
            src={backIcon}
          ></img>
        )}
        <Link to={`/challenge/new`}>
          <button className={"newChallenge"}>{"새로운 챌린지 생성"}</button>
        </Link>
      </div>
      <div className="header">
        <form onSubmit={onSubmit}>
          <div className = 'double'>
          <input id="input" placeholder=" " onSubmit = {onSubmit}/>
          <label for="input"> 어떤 챌린지를 찾으시나요?</label>
          <img
            className="search"
            onClick={onSubmit}
            alt="search"
            src={searchIcon}
          ></img>
          </div>
        </form>
        {message && <div className="errmsg">{message}</div>}
      </div>
      {longer && (
        <div className="findChallenge">
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
  const [expand, setExpand] = useState(false);

  return (
    <div
      onClick={() => setExpand(!expand)}
      className={cn("challengeItem", { expand })}
    >
      <div className="challengeName">{challenge.challengeName}</div>
      <img className="challengeImg" alt="yammy" src={tigerIcon} />
      <div className="participant">
        참여인원: {challenge.participantNumber}/{challenge.maxUserNumber}명
      </div>
      <div className="participant"> 주 인증횟수: {challenge.cntOfWeek}번</div>
      {expand && (
        <>
          <div className="createDate">
            생성일: {challenge.createDate.split("T")[0]}
          </div>
          <div className="createUser">
            생성원: {challenge.createUserNickName}
          </div>
          <div className="Details">
            챌린지 설명: <br />
            {challenge.challengeContent}
          </div>
          <Link to={`/challenge/${challenge.id}/room`}>
            <button className="challengeButton">챌린지 방 가기</button>
          </Link>
        </>
      )}
    </div>
  );
};
