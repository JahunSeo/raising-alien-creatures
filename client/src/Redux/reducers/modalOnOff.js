import * as types from "../actions/ActionTypes";

export const CHAL_INFO_TYPE = {
  DESC: "CHAL_INFO_DESC",
  ALIEN: "CHAL_INFO_ALIEN",
  CHAT: "CHAL_INFO_CHAT",
};

const initialState = {
  // showModal2: false, // TODO: refactoring
  chalInfoModal: null,
  // popup
  popupModal: null,
  popupMessage: "",
  popupKind: "SUCC",
  popupCallback: undefined,

  showSignUpModal: false,
  showSignInModal: false,
  showAuthRequest: false,
};

export default function modalOnOff(state = initialState, action) {
  switch (action.type) {
    case types.CURRENT_ROOM:
      return {
        ...state,
        chalInfoModal: null,
      };
    // case types.SHOW_MODAL2:
    //   return {
    //     ...state,
    //     showModal2: action.showModal2,
    //   };
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
    case types.SET_POPUP_MODAL:
      return {
        ...state,
        popupModal: action.popupModal,
        popupMessage: action.popupMessage,
        popupKind: action.popupKind,
        popupCallback: action.popupCallback,
      };
    case types.SHOW_AUTH_REQUEST:
      return {
        ...state,
        showAuthRequest: action.showAuthRequest,
      };
    case types.REQUEST_AUTH:
      return {
        ...state,
        showAuthRequest: false,
      };

    default:
      return state;
  }
}
