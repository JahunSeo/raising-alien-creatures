import React, { useEffect } from "react";
import Room from "../../../shared/room/RoomClient";
import { useParams } from "react-router-dom";

import api from "../../../apis";

export default function UserRoom(props) {
  // 유저 정보 가져오기
  let params = useParams();
  const roomId = `user-${params.userId}`;
  const { rooms, setRoomInfo } = props;
  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await api.get("/main");
        // console.log("fetch main data", res.data);
        if (res.data.result === "success") {
          // rooms 상태 정보
          if (!rooms.current) rooms.current = {};
          rooms.current[roomId] = new Room(roomId);
          rooms.current[roomId].initMonsters(res.data.data);
          rooms.current[roomId].start();
          // TODO: redux
          setRoomInfo({ roomId, aliens: res.data.data });
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
    // }, []);
  }, [roomId, rooms, setRoomInfo]);

  return <div></div>;
}
