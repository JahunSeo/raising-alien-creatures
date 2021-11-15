// 액션 생성 함수들
import * as types from "./ActionTypes";

export const showModal = (onoff) => ({
  type: types.SHOW_MODAL1,
  showModal1: onoff,
});

export const showModal2 = (onoff) => ({
  type: types.SHOW_MODAL2,
  showModal2: onoff,
});
