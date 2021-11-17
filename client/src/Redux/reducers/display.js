import { handleActions } from "redux-actions";
import * as types from "../actions/ActionTypes";

const initialState = {
  aliens_list: [],
};

const display = handleActions(
  {
    // 화면에 나타나는 alien들을 페이지별로 다르게 받아옴
    [types.DISPLAY]: (state, { payload: aliens }) => ({
      ...state,
      aliens_list: aliens
    }),
  },
  initialState
);
export default display;

