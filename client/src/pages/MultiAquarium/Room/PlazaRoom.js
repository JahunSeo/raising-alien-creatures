import React, { useEffect } from "react";
import Room from "../../../shared/room/RoomClient";

import api from "../../../apis";

export default function PlazaRoom(props) {
  // 챌린지 정보 가져오기
  const roomId = "plaza";
  useEffect(() => {
    const { rooms, setCurrRoomId, setAliens } = props;
    try {
      const fetchData = async () => {
        const res = await api.get("/main");
        console.log("fetch main data", res.data);
        if (res.data.result === "success") {
          // 서버에서 데이터를 받아온 상황을 전제로 구성

          // rooms 상태 정보
          if (!rooms.current) rooms.current = {};
          rooms.current[roomId] = new Room(roomId);
          rooms.current[roomId].initMonsters(res.data.data);
          rooms.current[roomId].start();

          // roomIds: react에서 state로 관리할 정보
          setCurrRoomId(roomId);
          //
          setAliens(res.data.data);
          console.log("rooms", rooms.current);
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
  }, []);

  return <div></div>;
}
