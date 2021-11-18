import React, { useEffect } from "react";
import Room from "../../../shared/room/RoomClient";
import { useDispatch } from "react-redux";
import * as actions from "../../../Redux/actions";
import api from "../../../apis";

export default function PlazaRoom(props) {
  const dispatch = useDispatch();

  // 챌린지 정보 가져오기
  const roomId = "plaza";
  const { rooms } = props;
  if (!rooms.current) rooms.current = {};
  if (!rooms.current[roomId]) rooms.current[roomId] = new Room(roomId);

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

  return <div></div>;
}
