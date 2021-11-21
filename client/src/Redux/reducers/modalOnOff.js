import * as types from "../actions/ActionTypes";

const initialState = {
  showModal1: false,
  showModal2: false,
  showModal3: false,
  showSignUpModal: false,
  showSignInModal: false,
};

export default function modalOnOff(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_MODAL1:
      return {
        ...state,
        showModal1: action.showModal1,
      };
    case types.SHOW_MODAL2:
      return {
        ...state,
        showModal2: action.showModal2,
      };
    case types.SHOW_MODAL3:
      return {
        ...state,
        showModal3: action.showModal3,
      };
    case types.SHOW_SIGNUP:
      return {
        ...state,
        showSignUpModal: action.showSignUpModal,
      };
    case types.SHOW_SIGNIN:
      return {
        ...state,
        showSignInModal: action.showSignInModal,
      };
    default:
      return state;
  }
}
