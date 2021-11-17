import React, { useEffect } from "react";
import Room from "../../../shared/room/RoomClient";
import { useParams } from "react-router-dom";

import api from "../../../apis";

export default function ChallengeRoom(props) {
  // 챌린지 정보 가져오기
  let params = useParams();
  const roomId = `challenge-${params.challengeId}`;
  const { rooms, setRoomInfo } = props;
  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await api.post("/user/aquarium/challenge", {
          challenge_id: params.challengeId,
        });
        // console.log("fetch challenge data", res.data.Alien);
        if (res.data.result === "success") {
          // rooms 상태 정보
          const aliens = res.data.Alien;
          if (!rooms.current) rooms.current = {};
          rooms.current[roomId] = new Room(roomId);
          rooms.current[roomId].initMonsters(aliens);
          rooms.current[roomId].start();
          // TODO: redux
          setRoomInfo({ roomId, aliens });
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
  }, [rooms, setRoomInfo]);

  return <div></div>;
}
