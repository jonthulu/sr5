import assignDeep from 'assign-deep';
import lodash from 'lodash';

import * as types from './actionTypes.js';
import * as roundsTypes from '../rounds/actionTypes.js';
import {flipCoin} from '../../services/characterHelper.js';

export const initialState = {
  characters: {
    freefall: {
      id: 'freefall',
      name: 'Freefall',
      mod: -2,
      edge: 3,
      reaction: 5,
      intuition: 3,
      coinToss: null,
      init: null,
      modlessInit: null,
      rawInit: null,
      wentThisPass: false,
    },
    noc: {
      id: 'noc',
      name: 'Noc',
      mod: 0,
      edge: 1,
      reaction: 5,
      intuition: 4,
      coinToss: null,
      init: null,
      modlessInit: null,
      rawInit: null,
      wentThisPass: false,
    }
  }
};

/**
 * Removes an item from the state.
 *
 * @param {{characters: {}}} state
 * @param {number|string} lookupId
 * @returns {{characters: {}}}
 */
function omitItemById(state, lookupId) {
  const newItems = Object.assign({}, state);
  delete newItems[lookupId];
  return newItems;
}

/**
 * Reduces the init of each character to 0 and reset the wentThisPass.
 *
 * @param {{}} allChars
 * @param {{}} character
 * @param {string} charId
 * @returns {{}}
 */
function reduceNewRound(allChars, character, charId) {
  allChars[charId] = Object.assign({}, character, {
    coinToss: flipCoin(),
    init: null,
    modlessInit: null,
    rawInit: null,
    wentThisPass: false,
  });
  return allChars;
}

/**
 * Reduces the init of each character to 0 and reset the wentThisPass.
 *
 * @param {{}} allChars
 * @param {{}} character
 * @param {string} charId
 * @returns {{}}
 */
function reduceNewPass(allChars, character, charId) {
  allChars[charId] = Object.assign({}, character, {
    init: character.init - 10,
    modlessInit: character.modlessInit - 10,
    wentThisPass: false,
  });
  return allChars;
}

/**
 * Reduces the character stats when all rounds end.
 *
 * @param {{}} allChars
 * @param {{}} character
 * @param {string} charId
 * @returns {{}}
 */
function reduceRoundStop(allChars, character, charId) {
  allChars[charId] = Object.assign({}, character, {
    coinToss: null,
    init: null,
    modlessInit: null,
    rawInit: null,
    wentThisPass: false,
  });
  return allChars;
}

/**
 * The characters reducer.
 *
 * @param {{}} state
 * @param {{}} action
 * @returns {{}}
 */
export function charactersReducer(state = initialState.characters, action) {
  switch (action.type) {
    case types.CHARACTER_CREATE:
      return assignDeep({}, state, {
        [action.id]: Object.assign({}, {
          coinToss: flipCoin(),
        }, action.charData),
      });

    case types.CHARACTER_DELETE:
      return omitItemById(state, action.id);

    case types.CHARACTER_UPDATE:
      return assignDeep({}, state, {
        [action.id]: Object.assign({}, state[action.id] || {}, action.charData || {}),
      });

    case types.CHARACTER_UPDATE_SOME:
      return assignDeep({}, state, action.charsData || {});

    case roundsTypes.ROUND_ADVANCE:
    case roundsTypes.ROUND_RESET:
      return assignDeep({}, state, lodash.reduce(state, reduceNewRound, {}));

    case roundsTypes.ROUND_PASS_ADVANCE:
      return assignDeep({}, state, lodash.reduce(state, reduceNewPass, {}));

    case roundsTypes.ROUND_STOP:
      return assignDeep({}, state, lodash.reduce(state, reduceRoundStop, {}));

    default:
      return state;
  }
}

export default {
  characters: charactersReducer,
};
