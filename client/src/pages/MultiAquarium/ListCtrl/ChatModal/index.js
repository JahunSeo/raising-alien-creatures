import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import * as socket from "../../../../apis/socket";

import "./Chat.css";
import {
  useDispatch,
  useSelector,
  // useDispatch
} from "react-redux";
import * as actions from "../../../../Redux/actions/index.js";
// import api from "../../../../apis/index.js";

const ChallengeModal = (props) => {
  const [currentMessage, setCurrentMessage] = useState("");
  // const [messageList, setMessageList] = useState([]);
  const { roomId } = useSelector(({ room }) => ({
    roomId: room.roomId,
  }));
  const { user } = useSelector(({ user }) => ({ user: user.user }));

  // console.log("roomId", roomId);
  // if (user) {
  //   console.log("nickname", user.nickname);
  // }
  const { chalInfoModal } = useSelector(({ modalOnOff }) => ({
    chalInfoModal: modalOnOff.chalInfoModal,
  }));

  const { messages } = useSelector(({ chat }) => ({
    messages: chat.messages,
  }));

  const { modalType } = props;
  const toggle = modalType && chalInfoModal === modalType;
  // const dispatch = useDispatch();

  const dispatch = useDispatch();
  useEffect(() => {
    socket.Message_receive();
    console.log("message_receive");
    console.log("정신호짱짱");
  });

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: roomId,
        author: user.nickname,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      socket.message_send(messageData);
      dispatch(actions.setMessage([...messages, messageData]));
      setCurrentMessage("");
    }
  };

  return (
    <div className={toggle ? "ChallengeContainer" : "hidden"}>
      <div class="boxborder">
        <div class="container px-1 max-w-xs py-5 mx-auto ">
          <div class="chat-header">
            <p>Live Chat</p>
          </div>
          <br />
          <br />

          <ScrollToBottom className="messages">
            {messages.map((messageContent) => {
              return (
                <div
                  class="message"
                  id={user.nickname === messageContent.author ? "you" : "other"} // css 파일에서 구분
                >
                  <div class="message-align">
                    <div class="message-content">
                      <p>{messageContent.message}</p>
                    </div>
                    <div class="message-meta">
                      <p>{messageContent.time}</p>
                      &nbsp;&nbsp;
                      <p>{messageContent.author}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollToBottom>

          <div class="chat-footer">
            <div class="relative flex">
              <input
                class="chat-input"
                type="text"
                value={currentMessage}
                placeholder=" Hey..."
                onChange={(event) => {
                  setCurrentMessage(event.target.value);
                }}
                onKeyPress={(event) => {
                  event.key === "Enter" && sendMessage();
                }}
              />
              <div class="absolute right-0 items-center inset-y-0 hidden sm:flex">
                <button class="send-button" onClick={sendMessage}>
                  &#9658;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
    </div>
  );
};

export default ChallengeModal;
