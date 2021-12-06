import * as types from "../actions/ActionTypes";

export const CHAL_INFO_TYPE = {
  DESC: "CHAL_INFO_DESC",
  ALIEN: "CHAL_INFO_ALIEN",
  CHAT: "CHAL_INFO_CHAT",
};

const initialState = {
  chalInfoModal: CHAL_INFO_TYPE.ALIEN,
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
      let modal = state.chalInfoModal;
      if (state.chalInfoModal === CHAL_INFO_TYPE.CHAT)
        modal = null;
      return {
        ...state,
        chalInfoModal: modal,
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

    default:
      return state;
  }
}
