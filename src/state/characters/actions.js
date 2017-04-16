import lodash from 'lodash';

import * as types from './actionTypes.js';
import {characterIdGenerator} from '../../services/characterHelper.js';

/**
 * Parses character update data into safe update data.
 *
 * @param {{}} data
 * @returns {{}}
 */
function parseUpdateData(data) {
  let safeData = {};

  if (data.init !== undefined) {
    const safeInit = parseInt(data.init, 10);
    if (isNaN(safeInit)) {
      console.log('before error', data, safeInit);
      throw new Error('CharacterUpdateAction: Non-number initiative value given.');
    }
    safeData.init = safeInit;
  }

  if (data.modlessInit !== undefined) {
    const safeModlessInit = parseInt(data.modlessInit, 10);
    if (isNaN(safeModlessInit)) {
      throw new Error('CharacterUpdateAction: Non-number modless initiative value given.');
    }
    safeData.modlessInit = safeModlessInit;
  }

  if (data.rawInit !== undefined) {
    const safeRawInit = parseInt(data.rawInit, 10);
    if (isNaN(safeRawInit)) {
      throw new Error('CharacterUpdateAction: Non-number raw initiative value given.');
    }
    safeData.rawInit = safeRawInit;
  }

  if (data.name !== undefined) {
    if (!data.name) {
      throw new Error('CharacterUpdateAction: Empty name value given.');
    }
    safeData.name = data.name;
  }

  if (data.mod !== undefined) {
    const safeModValue = parseInt(data.mod, 10);
    if (isNaN(safeModValue)) {
      throw new Error('CharacterUpdateAction: Non-number mod value given.');
    }
    safeData.mod = safeModValue;
  }

  if (data.edge !== undefined) {
    const safeEdgeValue = parseInt(data.edge, 10);
    if (isNaN(safeEdgeValue)) {
      throw new Error('CharacterUpdateAction: Non-number edge value given.');
    }
    safeData.edge = safeEdgeValue;
  }

  if (data.intuition !== undefined) {
    const safeIntuitionValue = parseInt(data.intuition, 10);
    if (isNaN(safeIntuitionValue)) {
      throw new Error('CharacterUpdateAction: Non-number intuition value given.');
    }
    safeData.intuition = safeIntuitionValue;
  }

  if (data.reaction !== undefined) {
    const safeReactionValue = parseInt(data.reaction, 10);
    if (isNaN(safeReactionValue)) {
      throw new Error('CharacterUpdateAction: Non-number reaction value given.');
    }
    safeData.reaction = safeReactionValue;
  }

  if (data.coinToss !== undefined) {
    safeData.coinToss = data.coinToss;
  }

  if (data.wentThisPass !== undefined) {
    safeData.wentThisPass = Boolean(data.wentThisPass);
  }

  return safeData;
}

/**
 * Creates a new character.
 *
 * @param {{}} data
 * @returns {{type: string, id: string, charData: {}}}
 */
export function characterCreate(data) {
  let safeData = {};

  if (data.name !== undefined) {
    if (!data.name) {
      throw new Error('CharacterCreateAction: Empty name value given.');
    }
    safeData.name = data.name;
  }

  if (data.edge !== undefined) {
    const safeEdgeValue = parseInt(data.edge, 10);
    if (!safeEdgeValue && safeEdgeValue !== 0) {
      throw new Error('CharacterCreateAction: Non-number edge value given.');
    }
    safeData.edge = safeEdgeValue;
  }

  if (data.intuition !== undefined) {
    const safeIntuitionValue = parseInt(data.intuition, 10);
    if (!safeIntuitionValue && safeIntuitionValue !== 0) {
      throw new Error('CharacterCreateAction: Non-number intuition value given.');
    }
    safeData.intuition = safeIntuitionValue;
  }

  if (data.reaction !== undefined) {
    const safeReactionValue = parseInt(data.reaction, 10);
    if (!safeReactionValue && safeReactionValue !== 0) {
      throw new Error('CharacterCreateAction: Non-number reaction value given.');
    }
    safeData.reaction = safeReactionValue;
  }

  safeData.id = characterIdGenerator(safeData);

  return {
    type: types.CHARACTER_CREATE,
    id: safeData.id,
    charData: safeData,
  };
}

/**
 * Deletes a character.
 *
 * @param {string} characterId
 * @returns {{type: string, id: string}}
 */
export function characterDelete(characterId) {
  if (!characterId) {
    throw new Error('CharacterDeleteAction: No character id value given.');
  }

  return {
    type: types.CHARACTER_DELETE,
    id: String(characterId),
  };
}

/**
 * Updates a character.
 *
 * @param {string} characterId
 * @param {{name: string, init: number, mod: number}} data
 * @returns {{type: string, id: string, init: number}}
 */
export function characterUpdate(characterId, data) {
  if (!characterId) {
    throw new Error('CharacterUpdateAction: No character id value given.');
  } else if (!data || !lodash.isPlainObject(data) || !lodash.size(data)) {
    throw new Error('CharacterUpdateAction: No character data given.');
  }

  return {
    type: types.CHARACTER_UPDATE,
    id: String(characterId),
    charData: parseUpdateData(data),
  };
}

/**
 * Updates one or more characters.
 *
 * @param {Object.<string, {name: string, init: number, mod: number}>} charactersData
 * @returns {{type: string, charsData: {}}}
 */
export function characterUpdateSome(charactersData) {
  if (!charactersData || !lodash.isPlainObject(charactersData) || !lodash.size(charactersData)) {
    throw new Error('CharacterUpdateAction: No characters data given.');
  }

  return {
    type: types.CHARACTER_UPDATE_SOME,
    charsData: parseUpdateData(data),
  };
}
