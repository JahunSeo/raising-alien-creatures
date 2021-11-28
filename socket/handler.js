import Room from "./room/RoomSocket.js";
import User from "./room/User.js";

// temp: 엄청 커지는 상황을 생각해야 함
const rooms = {};
const users = {};
const clientToUser = {};

export const join = (socket, userinfo) => {
  const clientId = socket.id;
  const userId = userinfo.id;
  console.log(`[join] (clientId) ${clientId}, (userId) ${userId}`);
  // user id 확인
  if (!userId) return false; // ERROR
  // 새로운 user 생성
  if (!users[userId]) {
    users[userId] = new User(userinfo);
  }
  // user에 clientId 추가
  users[userId].addClient(clientId);
  // clientToUser에 추가
  clientToUser[clientId] = userId;
};

export const disconnect = (socket) => {
  const clientId = socket.id;
  const userId = clientToUser[clientId];
  console.log(`[disconnect] (clientId) ${clientId}, (userId) ${userId}`);
  // user에서 client 제거
  users[userId].removeClient(clientId);
  // user를 지속 관리할 필요가 없을 경우 제거
  if (users[userId].getClientCnt() <= 0) {
    delete users[userId];
  }
  // clientToUser에서 client 제거
  delete clientToUser[clientId];
};
