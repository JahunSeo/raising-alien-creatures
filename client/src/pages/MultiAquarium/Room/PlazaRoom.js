import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../../Redux/actions";

import aquarium from "../../../shared";
import api from "../../../apis";

import SearchBox from "../SearchBox";

export default function PlazaRoom(props) {
  const dispatch = useDispatch();

  // 챌린지 정보 가져오기
  const roomId = "plaza";
  const room = aquarium.setCurrentRoom(roomId);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await api.get("/main");
        console.log("fetch main data", res.data);
        if (res.data.result === "success") {
          // Canvas에 반영
          console.log("plazaroom:", roomId);
          const aliens = res.data.aliens;
          room.initMonsters(aliens);
          room.start();

          // redux에 저장
          const roomTitle = `CHAL-IT`;
          dispatch(actions.setRoom({ roomId, aliens, roomTitle }));
        } else {
        }
      };
      fetchData();
    } catch (err) {
      console.error("fetchData fail", err);
    }
    return () => {
      dispatch(actions.setRoom({ roomId: null, aliens: [] }));
      room.close();
    };
    //   }, []);
  }, [room, roomId, dispatch]);

  return <SearchBox />;
}
