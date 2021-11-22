import { handleActions } from "redux-actions";
import * as types from "../actions/ActionTypes";

const initialState = {
  messages: [],
};

const chat = handleActions(
  {
    [types.MESSAGE_UPDATE]: (state, { payload: msg }) => ({
      ...state,
      messages: [...state.messages, msg],
    }),
  },
  initialState
);
export default chat;
