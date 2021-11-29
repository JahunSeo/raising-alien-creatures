export default class User {
  constructor(props) {
    this.id = props.id;
    this.nickname = props.nickname;
    this.challenges = props.challenges || [];
    this.clients = {};
  }

  addClient(clientId) {
    this.clients[clientId] = true;
  }

  removeClient(clientId) {
    delete this.clients[clientId];
  }

  getClientCnt() {
    return Object.keys(this.clients).length;
  }
}
