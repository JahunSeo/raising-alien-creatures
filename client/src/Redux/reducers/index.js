import { combineReducers } from "redux";
import modalOnOff from "./modalOnOff";
import user from './user'
import display from './display'

export const reducers = combineReducers({
  modalOnOff,
  user,
  display,
});
