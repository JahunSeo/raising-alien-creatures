import Room from "./room/RoomSocket.js";
import User from "./room/User.js";

// temp: 엄청 커지는 상황을 생각해야 함
const rooms = {};
const users = {};
const clientToUser = {};

export const join = (socket, userinfo) => {
  console.log(userinfo);
  const clientId = socket.id;
  const userId = userinfo.id;
  console.log(`[join] (clientId) ${clientId}, (userId) ${userId}`);
  // user id 확인
  if (!userId) return false; // ERROR
  // user가 없는 경우 새로운 user 생성
  if (!users[userId]) {
    users[userId] = new User(userinfo);
  }
  // user에 clientId 추가
  users[userId].addClient(clientId);
  // clientToUser에 추가
  clientToUser[clientId] = userId;
  // 참여 중인 챌린지의 room 각각에 조인
  users[userId].challenges.forEach((challenge) => {
    const challengeId = challenge.id;
    // room이 없는 경우 새로운 room 생성
    if (!rooms[challengeId]) rooms[challengeId] = new Room(challenge);
    // room에 user 추가 (이 때, 다른 clientId로 접속했던 동일 user 존재 가능)
    rooms[challengeId].addUser(users[userId]);
    // socket join
    socket.join(challengeId);
  });
};

export const disconnect = (socket) => {
  const clientId = socket.id;
  const userId = clientToUser[clientId];
  console.log(`[disconnect] (clientId) ${clientId}, (userId) ${userId}`);
  if (!userId) return false; // ERROR
  // user에서 client 제거
  users[userId].removeClient(clientId);
  // user를 지속 관리할 필요가 없을 경우 제거
  if (users[userId].getClientCnt() <= 0) {
    // 참여 중인 챌린지의 room 각각에서 user 정보 제거
    users[userId].challenges.forEach((challenge) => {
      const challengeId = challenge.id;
      // room에서 user 제거
      rooms[challengeId].removeUser(userId);
      // room을 지속 관리할 필요가 없을 경우 제거
      if (rooms[challengeId].getUserCnt() <= 0) {
        delete rooms[challengeId];
        // console.log("   [room] delete", challengeId);
      }
    });
    // users에서 제거
    delete users[userId];
  }
  // clientToUser에서 client 제거
  delete clientToUser[clientId];
};

export const sendMessage = (socket, data) => {
  const clientId = socket.id;
  // console.log("(data)", data);
  console.log(
    `[send_message] (clientId) ${clientId}, (msg) ${data.challengeId}`
  );
  socket.to(data.challengeId).emit("receive_message", data);
};

export const authRequest = (socket, data) => {
  const clientId = socket.id;
  console.log(
    `[auth_request] (clientId) ${clientId}, (msg) ${data.challengeId}`
  );
  socket.to(data.challengeId).emit("auth_request", data);
};

export const authApproval = (socket, data) => {
  const clientId = socket.id;
  console.log(
    `[auth_approval] (clientId) ${clientId}, (msg) ${data.challengeId} ${data.senderId} ${data.receiverId}`
  );
  socket.to(data.challengeId).emit("auth_approval", data);

  // // 타겟 유저의 모든 socketId로 개인 메시지 전송
  // for (const socketId in users[data.receiverId].clients) {
  //   socket.to(socketId).emit("auth_approval", data);
  // }
};
