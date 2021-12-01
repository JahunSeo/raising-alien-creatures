import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import * as socket from "../../../../apis/socket";
import api from "../../../../apis/index";
import "./Chat.css";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../../Redux/actions/index.js";

const ChatModal = (props) => {
  const [currentMessage, setCurrentMessage] = useState("");
  // const [messageList, setMessageList] = useState([]);
  const dispatch = useDispatch();
  const { challengeId } = useParams();

  const { user } = useSelector(({ user }) => ({ user: user.user }));
  const { chalInfoModal } = useSelector(({ modalOnOff }) => ({
    chalInfoModal: modalOnOff.chalInfoModal,
  }));
  let { messages } = useSelector(({ room }) => ({
    messages: room.messages,
  }));

  const { modalType } = props;
  const toggle = modalType && chalInfoModal === modalType;

  const saveChat = async (messageData) => {
    messageData.challenge_id = challengeId;
    const res = await api.post("/chat", messageData);
    if (res.data.result !== "success") {
      console.error("메시지 저장 실패");
    }
  };

  const sendMessage = async () => {
    if (!user) return;
    if (currentMessage !== "") {
      const messageData = {
        challengeId: Number(challengeId),
        user_nickname: user.nickname,
        message: currentMessage,
        time:
          new Date(Date.now()).getMonth() +
          1 +
          "월" +
          " " +
          new Date(Date.now()).getDate() +
          "일" +
          " " +
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      // console.log("sendMsg", messageData);
      saveChat(messageData);
      socket.sendMessage(messageData);
      dispatch(actions.setMessage([messageData]));
      setCurrentMessage("");
    }
  };

  const sendEmojis = async(emoji)=>{
    if (!user) return;
      const messageData = {
        challengeId: Number(challengeId),
        user_nickname: user.nickname,
        message: emoji,
        time:
          new Date(Date.now()).getMonth() +
          1 +
          "월" +
          " " +
          new Date(Date.now()).getDate() +
          "일" +
          " " +
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      // console.log("sendMsg", messageData);
      saveChat(messageData);
      socket.sendMessage(messageData);
      dispatch(actions.setMessage([messageData]));
  }

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
          <div className = 'emojis'>
            <span onClick={()=>sendEmojis('😊')} >😊</span>
            <span onClick={()=>sendEmojis('😎')} >😎</span>
            <span onClick={()=>sendEmojis('🤣')} >🤣</span>
            <span onClick={()=>sendEmojis('😍')} >😍</span>
            <span onClick={()=>sendEmojis('👍')} >👍</span>
            <span onClick={()=>sendEmojis('😝')} >😝</span>
            <span onClick={()=>sendEmojis('❤️')} >❤️</span>
            <span onClick={()=>sendEmojis('😉')} >😉</span>
            {/* <span onClick={()=>setCurrentMessage('😊')} >😊</span> */}

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

