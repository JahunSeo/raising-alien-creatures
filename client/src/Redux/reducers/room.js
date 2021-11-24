import { handleActions } from "redux-actions";
import * as types from "../actions/ActionTypes";

const initialState = {
  roomId: null,
  aliens: [],
  selectedAlien: null,
  messages: [],
};

const room = handleActions(
  {
    // 화면에 나타나는 alien들을 페이지별로 다르게 받아옴
    [types.CURRENT_ROOM]: (state, { payload: { roomId, aliens } }) => ({
      ...state,
      roomId: roomId,
      aliens: aliens,
      selectedAlien: null,
      messages: [],
    }),

    [types.SELECT_ALIEN]: (state, { payload: selectedAlien }) => ({
      ...state,
      selectedAlien: selectedAlien,
    }),

    [types.MESSAGE_UPDATE]: (state, { payload: msg }) => ({
      ...state,
      messages: [...state.messages, msg],
    }),
  },
  initialState
);
export default room;
