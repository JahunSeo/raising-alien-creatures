import * as types from "../actions/ActionTypes";

const initialState = {};

export default function alien_auth_func(state = initialState, action) {
  switch (action.type) {
    case types.ALIEN_AUTH:
      return {
        ...state,
        alien_auth: action.alien_auth,
      };
    default:
      return state;
  }
}
