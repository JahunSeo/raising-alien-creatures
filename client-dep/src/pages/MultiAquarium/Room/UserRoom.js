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
  const userId = params.userId;
  const roomId = `user-${userId}`;
  const { rooms } = props;
  if (!rooms.current) rooms.current = {};
  if (!rooms.current[roomId]) rooms.current[roomId] = new Room(roomId);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await api.get(`/user/${userId}`);
        // console.log("fetch main data", res.data);
        if (res.data.result === "success") {
          // rooms 상태 정보
          const aliens = res.data.data;
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
  }, [rooms, roomId, userId, dispatch]);

  return <div></div>;
}
