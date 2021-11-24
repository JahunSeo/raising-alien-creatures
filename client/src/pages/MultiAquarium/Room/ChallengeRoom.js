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
  const userId = user && user.id;
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
  }, [rooms, roomId, challengeId, dispatch]);

  useEffect(() => {
    // user가 참여중인 방인지 확인
    if (participating && rooms.current[roomId]) {
      // console.log("handle socket here!", participating);
      socket.initAndJoin({ roomId, userId: userId });
      socket.usersOnRoom(rooms.current[roomId].usersOnRoomHandler);
      socket.messageReceive((msg) => dispatch(actions.setMessage(msg)));
      // socket.subscribe(rooms.current[roomId].syncFieldState);
    } else if (rooms.current[roomId]) {
      rooms.current[roomId].eraseUsersOnRoom();
    }
    return () => {
      socket.disconnect(roomId);
    };
  }, [userId, rooms, roomId, challengeId, participating, dispatch]);

  return <div></div>;
}
