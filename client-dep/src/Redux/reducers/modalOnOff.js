import * as types from "../actions/ActionTypes";

export const CHAL_INFO_TYPE = {
  DESC: "CHAL_INFO_DESC",
  ALIEN: "CHAL_INFO_ALIEN",
  CHAT: "CHAL_INFO_CHAT",
};

const initialState = {
  showModal2: false, // TODO: refactoring

  chalInfoModal: null,
};

export default function modalOnOff(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_MODAL2:
      return {
        ...state,
        showModal2: action.showModal2,
      };
    case types.SET_CHAL_INFO_MODAL:
      return {
        ...state,
        chalInfoModal: action.chalInfoModal,
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
