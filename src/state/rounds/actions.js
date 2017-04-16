import * as types from './actionTypes.js';

/**
 * Advances to the next pass in the current round.
 *
 * @returns {{type: string}}
 */
export function passAdvance() {
  return {
    type: types.ROUND_PASS_ADVANCE,
  };
}

/**
 * Advances to the next round.
 *
 * @returns {{type: string}}
 */
export function roundAdvance() {
  return {
    type: types.ROUND_ADVANCE,
  };
}

/**
 * Pauses the round.
 *
 * @param {boolean=} unpause If true, the round is unpaused.
 * @returns {{type: string, unpause: boolean}}
 */
export function roundPause(unpause) {
  return {
    type: types.ROUND_PAUSE,
    unpause: Boolean(unpause),
  };
}

/**
 * Reruns the round, setting the pass number to 0.
 *
 * @returns {{type: string}}
 */
export function roundReset() {
  return {
    type: types.ROUND_RESET,
  };
}

/**
 * Stops the round, resetting the round number and pass number to 0.
 *
 * @returns {{type: string}}
 */
export function roundStop() {
  return {
    type: types.ROUND_STOP,
  };
}
