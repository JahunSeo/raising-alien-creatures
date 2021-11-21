import * as types from "../actions/ActionTypes";

export const CHAL_INFO_TYPE = {
  DESC: "CHAL_INFO_DESC",
  ALIEN: "CHAL_INFO_ALIEN",
  CHAT: "CHAL_INFO_CHAT",
};

const initialState = {
  showModal1: false,
  showModal2: false,
  showModal3: false,

  chalInfoModal: null,
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
    case types.SET_CHAL_INFO_MODAL:
      return {
        ...state,
        chalInfoModal: action.chalInfoModal,
      };

    default:
      return state;
  }
}
