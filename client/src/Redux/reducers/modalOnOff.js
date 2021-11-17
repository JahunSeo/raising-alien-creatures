import * as types from "../actions/ActionTypes";

const initialState = {
  showModal1: false,
  showModal2: false,
  showModalChal: false,
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
    case types.SHOW_MODALCHAL:
      return {
        ...state,
        showModalChal: action.showModalChal,
      };
    default:
      return state;
  }
}
