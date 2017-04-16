import * as types from './actionTypes.js';

export const initialState = {
  rounds: {
    isPaused: false,
    roundNumber: 0,
    passNumber: 0,
  },
};

/**
 * The rounds reducer.
 *
 * @param {{}} state
 * @param {{}} action
 * @returns {{}}
 */
export function roundsReducer(state = initialState.rounds, action) {
  switch (action.type) {
    case types.ROUND_ADVANCE:
      return Object.assign({}, state, {
        roundNumber: state.roundNumber + 1,
        passNumber: 1,
      });

    case types.ROUND_PASS_ADVANCE:
      return Object.assign({}, state, {
        passNumber: state.passNumber + 1,
      });

    case types.ROUND_PAUSE:
      return Object.assign({}, state, {
        isPaused: !(action.unpause),
      });

    case types.ROUND_RESET:
      return Object.assign({}, state, {
        passNumber: 0,
      });

    case types.ROUND_STOP:
      return Object.assign({}, state, {
        roundNumber: 0,
        passNumber: 0,
      });

    default:
      return state;
  }
}

export default {
  rounds: roundsReducer,
};
