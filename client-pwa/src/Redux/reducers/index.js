import { combineReducers } from "redux";
import modalOnOff from "./modalOnOff";
import user from "./user";
import room from "./room";
import alien_auth_func from "./alien_auth";

export const reducers = combineReducers({
  alien_auth_func,
  modalOnOff,
  user,
  room,
});
