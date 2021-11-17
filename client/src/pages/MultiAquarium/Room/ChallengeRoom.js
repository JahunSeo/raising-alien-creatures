import React, { useEffect } from "react";
import Room from "../../../shared/room/RoomClient";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as actions from "../../../Redux/actions";

import api from "../../../apis";
import * as socket from "../../../apis/socket";

export default function ChallengeRoom(props) {
  const dispatch = useDispatch();
  // 챌린지 정보 가져오기
  let params = useParams();
  const roomId = `challenge-${params.challengeId}`;
  const { rooms, setRoomInfo } = props;
  useEffect(() => {
    try {
      const fetchData = async () => {
        if (!rooms.current) rooms.current = {};
        const res = await api.post("/user/aquarium/challenge", {
          challenge_id: params.challengeId,
        });
        // console.log("fetch challenge data", res.data.Alien);
        if (res.data.result === "success") {
          // rooms 상태 정보
          const aliens = res.data.Alien;
          rooms.current[roomId] = new Room(roomId);
          rooms.current[roomId].initMonsters(aliens);
          socket.initAndJoin(roomId);
          // socket.subscribe(rooms.current[roomId].syncFieldState);
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
      socket.disconnect();
      rooms.current[roomId].close();
    };
    //   }, []);
  }, [rooms, setRoomInfo]);

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
