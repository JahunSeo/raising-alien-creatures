import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as actions from "../../../Redux/actions";
import api from "../../../apis";
import aquarium from "../../../shared";

export default function UserRoom(props) {
  const dispatch = useDispatch();
  // 유저 정보 가져오기
  let params = useParams();
  const userId = params.userId;
  const roomId = `user-${userId}`;
  const room = aquarium.setCurrentRoom(roomId);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await api.get(`/user/${userId}`);
        // console.log("fetch main data", res.data);
        if (res.data.result === "success") {
          // rooms 상태 정보
          const aliens = res.data.aliens;
          const user = res.data.user;
          const roomTitle = `${user.nickname}`;
          aliens.forEach((alien) => {
            alien.practiceDays = [
              alien.sun,
              alien.mon,
              alien.tue,
              alien.wed,
              alien.thu,
              alien.fri,
              alien.sat,
            ];
            alien.showBubble = true;
          });
          room.initMonsters(aliens);
          room.start();
          // update redux room info
          dispatch(actions.setRoom({ roomId, aliens, roomTitle }));
        } else {
        }
      };
      fetchData();
    } catch (err) {
      console.error("fetchData fail", err);
    }
    return () => {
      room.close();
    };
    // }, []);
  }, [room, roomId, userId, dispatch]);

  return <div></div>;
}
