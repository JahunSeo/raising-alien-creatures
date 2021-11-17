import React, { useEffect } from "react";
import Room from "../../../shared/room/RoomClient";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as actions from "../../../Redux/actions";
import api from "../../../apis";

export default function UserRoom(props) {
  const dispatch = useDispatch();
  // 유저 정보 가져오기
  let params = useParams();
  const roomId = `user-${params.userId}`;
  const { rooms } = props;
  useEffect(() => {
    try {
      const fetchData = async () => {
        if (!rooms.current) rooms.current = {};
        const res = await api.get(`/user/${params.userId}`);
        console.log("fetch main data", res.data);
        if (res.data.result === "success") {
          // rooms 상태 정보
          const aliens = res.data.data;
          rooms.current[roomId] = new Room(roomId);
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
    // }, []);
  }, [roomId, rooms, dispatch]);

  return <div></div>;
}
