import React, { useState } from "react";
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
  const dispatch = useDispatch();
  const { roomId } = useSelector(({ room }) => ({
    roomId: room.roomId,
  }));
  const { user } = useSelector(({ user }) => ({ user: user.user }));

  // console.log("roomId", roomId);
  // if (user) {wef
  //   console.log("nickname", user.nickname);
  // }
  const { chalInfoModal } = useSelector(({ modalOnOff }) => ({
    chalInfoModal: modalOnOff.chalInfoModal,
  }));

  const { messages } = useSelector(({ room }) => ({
    messages: room.messages,
  }));

  const { modalType } = props;
  const toggle = modalType && chalInfoModal === modalType;
  // const dispatch = useDispatch();

  const sendMessage = async () => {
    if (!user) return;
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
      socket.messageSend(messageData);
      dispatch(actions.setMessage(messageData));
      setCurrentMessage("");
    }
  };

  return (
    <div className={toggle ? "ChallengeContainer" : "hidden"}>
      <div className="boxborder  px-1 mx-auto py-1 my-auto h-full">
        <div className="chat-header">
          <p className="font-sans text-white bg-indigo-400 bg-opacity-25 rounded-xl">
            TALK !{" "}
          </p>
        </div>
        <br />

        <ScrollToBottom className="messages">
          {!!user &&
            messages.map((messageContent, index) => {
              return (
                <div
                  className="message"
                  key={index}
                  id={user.nickname === messageContent.author ? "you" : "other"} // css 파일에서 구분
                >
                  <div className="message-align">
                    <div className="message-content">
                      <p>{messageContent.message}</p>
                    </div>
                    <div className="message-meta">
                      <p>{messageContent.time}</p>
                      &nbsp;&nbsp;
                      <p>{messageContent.author}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </ScrollToBottom>

        <div className="chat-footer">
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

      {/* </div> */}
    </div>
  );
};

export default ChallengeModal;
