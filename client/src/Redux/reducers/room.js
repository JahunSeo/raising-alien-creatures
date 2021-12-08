import { handleActions } from "redux-actions";
import * as types from "../actions/ActionTypes";

const initialState = {
  roomId: null,
  roomTitle: null,
  aliens: [],
  selectedAlien: null,
  challenge: {},
  messages: [],
};

const room = handleActions(
  {
    // 화면에 나타나는 alien들을 페이지별로 다르게 받아옴
    [types.CURRENT_ROOM]: (
      state,
      { payload: { roomId, aliens, roomTitle, challenge } }
    ) => ({
      ...state,
      roomId: roomId,
      roomTitle: roomTitle || null,
      aliens: aliens || [],
      selectedAlien: null,
      challenge: challenge || {},
      messages: [],
    }),

    [types.SELECT_ALIEN]: (state, { payload: selectedAlien }) => ({
      ...state,
      selectedAlien: selectedAlien,
    }),

    [types.GRADUATE_ALIEN]: (state, { payload: alienId }) => ({
      ...state,
      aliens: state.aliens.map((alien) =>
        alien.id === alienId ? { ...alien, alien_status: 1, practice_status: 0 } : alien
      ),
    }),

    [types.THANOS_ALIENS]: (state, { payload: killed }) => ({
      ...state,
      aliens: state.aliens
        .filter((alien) => killed.indexOf(alien.id) === -1)
        .map((alien) => ({ ...alien, practice_status: 0 })),
    }),

    [types.REQUEST_AUTH]: (state, { payload: alienId }) => ({
      ...state,
      aliens: state.aliens.map((alien) =>
        alien.id === alienId ? { ...alien, practice_status: 1 } : alien
      ),
    }),

    [types.APPROVE_AUTH]: (state, { payload: alienId }) => ({
      ...state,
      aliens: state.aliens.map((alien) =>
        alien.id === alienId
          ? {
            ...alien,
            practice_status: 2,
            accumulated_count: alien.accumulated_count + 1,
          }
          : alien
      ),
    }),

    [types.MESSAGE_UPDATE]: (state, { payload: msgArray }) => ({
      ...state,
      messages: [...state.messages, ...msgArray],
    }),
  },
  initialState
);
export default room;
