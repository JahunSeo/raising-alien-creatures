import { combineReducers } from "redux";
import modalOnOff from "./modalOnOff";
import user from './user'
import room from './room'

export const reducers = combineReducers({
  modalOnOff,
  user,
  room,
});
