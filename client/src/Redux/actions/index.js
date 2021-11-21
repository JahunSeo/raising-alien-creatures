// 액션 생성 함수들
import * as types from "./ActionTypes";

export const showModal1 = (onoff) => ({
  type: types.SHOW_MODAL1,
  showModal1: onoff,
});

export const showModal2 = (onoff) => ({
  type: types.SHOW_MODAL2,
  showModal2: onoff,
});

export const showModal3 = (onoff) => ({
  type: types.SHOW_MODAL3,
  showModal3: onoff,
});

export const checkUser = (res) => ({
  type: types.CHECK_USER,
  payload: res,
});

export const logout = () => ({
  type: types.LOGOUT,
});

export const setRoom = ({ roomId, aliens }) => ({
  type: types.CURRENT_ROOM,
  payload: { roomId, aliens },
});

export const alienAuth = (alien_auth) => ({
  type: types.ALIEN_AUTH,
  alien_auth: alien_auth,
});
