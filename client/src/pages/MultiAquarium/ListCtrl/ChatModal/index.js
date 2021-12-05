import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import * as socket from "../../../../apis/socket";
import api from "../../../../apis/index";
import "./Chat.css";
import { useDispatch, useSelector } from "react-redux";
import aquarium from "../../../../shared";
import * as actions from "../../../../Redux/actions/index.js";

const ChatModal = (props) => {
  const dispatch = useDispatch();
  const { challengeId } = useParams();
  const { user, chalInfoModal, messages, aliens } = useSelector(
    ({ user, modalOnOff, room }) => ({
      user: user.user,
      chalInfoModal: modalOnOff.chalInfoModal,
      messages: room.messages,
      aliens: room.aliens,
    })
  );
    
  let participating = false;
  if (user.login && user.challenges) {
    participating = user.challenges.findIndex((c) => c.id === Number(challengeId)) !== -1;
  }

  const myAlien = aliens.find((a) => a.user_info_id === user.id);

  const { modalType } = props;
  const toggle = modalType && chalInfoModal === modalType;

  const [currentMessage, setCurrentMessage] = useState("");

  const saveChat = async (messageData) => {
    messageData.challenge_id = challengeId;
    const res = await api.post("/chat", messageData);
    if (res.data.result !== "success") {
      console.error("메시지 저장 실패");
    }
  };

  const sendMessage = async () => {
    if (!participating) return;
    if (currentMessage !== "") {
      const curDate = new Date(Date.now());
      const messageData = {
        challengeId: Number(challengeId),
        user_nickname: user.nickname,
        message: currentMessage,
        time:
          curDate.getMonth() +
          1 +
          "월 " +
          curDate.getDate() +
          "일 " +
          curDate.getHours() +
          ":" +
          curDate.getMinutes(),
      };
      // console.log("sendMsg", messageData);
      saveChat(messageData);
      socket.sendMessage(messageData);
      dispatch(actions.setMessage([messageData]));
      setCurrentMessage("");
    }
  };

  //emojis
  const sendEmojis = async (emoji) => {
    if (!participating) return;
    const curDate = new Date(Date.now());
    const messageData = {
      challengeId: Number(challengeId),
      alienId: myAlien.id,
      user_nickname: user.nickname,
      message: emoji,
      time:
        curDate.getMonth() +
        1 +
        "월 " +
        curDate.getDate() +
        "일 " +
        curDate.getHours() +
        ":" +
        curDate.getMinutes(),
      type: "CHAT_EMOJI",
    };
    saveChat(messageData);
    dispatch(actions.setMessage([messageData]));
    socket.sendMessage(messageData);

    const alien = aquarium.getCurrentRoom().getMonster(myAlien.id);
    if (alien) alien.setEmojis(emoji);
  };

  return (
    <div className={toggle ? "ChallengeContainer" : "hidden"}>
      <div className="boxborder px-1 mx-auto py-1 my-1 h-full">
        <div className="chat-header">
          <p className="font-sans text-white bg-indigo-400 bg-opacity-25 rounded-xl">
            TALK !
          </p>
        </div>
        <br />

        <ScrollToBottom className="messages">
          {!!user &&
            user.login &&
            messages.map((messageContent, index) => {
              return (
                <div
                  className="message"
                  key={index}
                  id={
                    user.nickname === messageContent.user_nickname
                      ? "you"
                      : "other"
                  } // css 파일에서 구분
                >
                  <div className="message-align">
                    <div className="message-content">
                      <p>{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                      <p>{messageContent.time}</p>
                      &nbsp;&nbsp;
                      <p>{messageContent.user_nickname}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </ScrollToBottom>

        <div className="chat-footer">
          <div className="emojis">
            <span onClick={() => sendEmojis("😊")}>😊</span>
            <span onClick={() => sendEmojis("😎")}>😎</span>
            <span onClick={() => sendEmojis("🤣")}>🤣</span>
            <span onClick={() => sendEmojis("😍")}>😍</span>
            <span onClick={() => sendEmojis("👍")}>👍</span>
            <span onClick={() => sendEmojis("😝")}>😝</span>
            <span onClick={() => sendEmojis("❤️")}>❤️</span>
            <span onClick={() => sendEmojis("😉")}>😉</span>
          </div>
          <div className="relative flex">
            <input
              className="chat-input"
              type="text"
              value={currentMessage}
              placeholder=" Hey....."
              onChange={(event) => {
                setCurrentMessage(event.target.value);
              }}
              onKeyPress={(event) => {
                event.key === "Enter" && sendMessage();
              }}
            />
            <div className="absolute right-0 items-center inset-y-0 md:flex">
              <button className="send-button" onClick={sendMessage}>
                &#9658;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
