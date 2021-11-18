import React, { useEffect } from "react";
import Room from "../../../shared/room/RoomClient";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../Redux/actions";

import api from "../../../apis";
import * as socket from "../../../apis/socket";

export default function ChallengeRoom(props) {
  const dispatch = useDispatch();
  // 챌린지 정보 가져오기
  let params = useParams();
  const challengeId = params.challengeId;
  const roomId = `challenge-${challengeId}`;
  const { rooms } = props;
  if (!rooms.current) rooms.current = {};
  if (!rooms.current[roomId]) rooms.current[roomId] = new Room(roomId);

  // user 정보 확인
  const { user } = useSelector(({ user }) => ({ user: user.user }));
  const isChaIdIn = (challenges, cId) => {
    return challenges.findIndex((c) => c.Challenge_id === cId) !== -1;
  };
  let participating = user && isChaIdIn(user.challenges, Number(challengeId));
  // console.log("[ChallengeRoom] is participating?", participating);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await api.post("/user/aquarium/challenge", {
          challenge_id: challengeId,
        });
        // console.log("fetch challenge data", res.data.Alien);
        if (res.data.result === "success") {
          // rooms 상태 정보
          const aliens = res.data.Alien;
          rooms.current[roomId].initMonsters(aliens);
          rooms.current[roomId].start();
          // update redux room info
          dispatch(actions.setRoom({ roomId, aliens }));
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
  }, [rooms, roomId, challengeId, dispatch]);

  useEffect(() => {
    // user가 참여중인 방인지 확인
    if (participating && rooms.current[roomId]) {
      // console.log("handle socket here!", participating);
      socket.initAndJoin({ roomId, userId: user.id });
      socket.usersOnRoom(rooms.current[roomId].usersOnRoomHandler);
      // socket.subscribe(rooms.current[roomId].syncFieldState);
    } else if (rooms.current[roomId]) {
      rooms.current[roomId].eraseUsersOnRoom();
    }
    return () => {
      console.log("challenge", 123);
      socket.disconnect(roomId);
    };
  }, [rooms, roomId, challengeId, participating]);

  return <div></div>;
}

// 주의! 아직 지우지 말기! 챌린지 리스트 그릴 때 소켓 방식 활용해야 함
// useEffect(() => {
//   // rooms가 생성되었는지 확인
//   if (!rooms.current || !currRoomId) return;

//   // 해당 room에 조인
//   console.log("set currRoomId", currRoomId);
//   // socket.initAndJoin(currRoomId);
//   // socket.subscribe(rooms.current[currRoomId].syncFieldState);
//   // room의 update logic start
//   rooms.current[currRoomId].start();

//   return () => {
//     // socket.disconnect();
//     rooms.current[currRoomId].close();
//   };
// }, [currRoomId]);
