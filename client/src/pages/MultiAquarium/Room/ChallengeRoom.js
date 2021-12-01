import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../../Redux/actions";

import aquarium from "../../../shared";
import api from "../../../apis";
import * as socket from "../../../apis/socket";

export default function ChallengeRoom(props) {
  const dispatch = useDispatch();
  // 챌린지 정보 가져오기
  let params = useParams();
  const challengeId = params.challengeId;
  const roomId = `challenge-${challengeId}`;
  const room = aquarium.setCurrentRoom(roomId);

  // user 정보 확인
  const { user, isSocketOn, aliens } = useSelector(({ user, room }) => ({
    user: user.user,
    isSocketOn: user.isSocketOn,
    aliens: room.aliens,
  }));
  // const userId = user.login && user.id;

  // 본 챌린지에 참가중인지 확인
  let participating = false;
  let myAlienId = null;
  if (user.login && user.challenges) {
    participating =
      user.challenges.findIndex((c) => c.id === Number(challengeId)) !== -1;
    if (participating) {
      let alien = aliens.find((a) => a.user_info_id === Number(user.id));
      myAlienId = !!alien && alien.id;
    }
  }

  // console.log("[ChallengeRoom] is participating?", participating);

  useEffect(() => {
    try {
      const fetchData = async () => {
        let res = await api.get(`/challenge/${challengeId}`);
        // console.log("fetch challenge data", res.data);
        if (res.data.result === "success") {
          // rooms 상태 정보
          const aliens = res.data.aliens;
          const challenge = res.data.challenge;
          const roomTitle = `${challenge.challenge_name}`;
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
          dispatch(actions.setRoom({ roomId, aliens, roomTitle, challenge }));
        } else {
          return;
        }
        res = await api.get(`/chat/${challengeId}`);
        if (res.data.result === "success") {
          const messages = res.data.data;
          dispatch(actions.setMessage(messages));
        } else {
          return;
        }
      };
      fetchData();
    } catch (err) {
      console.error("fetchData fail", err);
    }
    return () => {
      room.close();
    };
  }, [room, roomId, challengeId, dispatch]);

  // 참여중인 챌린지인 경우 처리
  useEffect(() => {
    if (isSocketOn && participating && room) {
      socket.receiveMessage((msg) => dispatch(actions.setMessage([msg])));
      //     socket.usersOnRoom(room.usersOnRoomHandler);
    }
    return () => {
      socket.blockMessage();
    };
  }, [isSocketOn, challengeId, participating, room, roomId, dispatch]);

  useEffect(() => {
    if (participating && room && myAlienId) {
      dispatch(actions.selectAlien(myAlienId));
      const alien = room.getMonster(myAlienId);
      room.camera.setChasingTarget(alien, () => {
        dispatch(actions.selectAlien(null));
      });
    }
  }, [myAlienId, participating, room, dispatch]);

  return <div></div>;
}
