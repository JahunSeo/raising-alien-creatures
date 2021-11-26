import { handleActions } from "redux-actions";
import * as types from "../actions/ActionTypes";

const initialState = {
  user: null,
};

const user = handleActions(
  {
    // 서버에서 로그인된 유저 정보 check 하고 response로 받아와서 user에 넣어줌
    [types.CHECK_USER]: (state, { payload: user }) => ({
      ...state,
      user: user,
    }),

    // 로그아웃 시, store의 user값을 null로 업데이트
    [types.LOGOUT]: (state) => ({
      ...state,
      user: { login: false },
    }),

    [types.JOIN_CHALLENGE]: (state, { payload: challenge }) => ({
      ...state,
      user: {
        ...state.user,
        challenges: [...state.user.challenges, challenge],
      },
    }),
  },
  initialState
);
export default user;
