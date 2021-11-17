import { handleActions } from "redux-actions";
import * as types from "../actions/ActionTypes";

const initialState = {
  aliens_list: [],
};

const display = handleActions(
  {
    [types.DISPLAY]: (state, { payload: aliens }) => ({
      ...state,
      aliens_list: aliens
    }),
  },
  initialState
);
export default display;

