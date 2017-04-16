import lodash from 'lodash';

/**
 * Generates an id for the given character.
 *
 * @param {{name: string}} character
 * @returns {string}
 */
export function characterIdGenerator(character) {
  if (!character) {
    throw new Error('No character data given.');
  } else if (!character.name) {
    throw new Error('No character name in character data.');
  }

  const safeCharName = String(character.name).toLowerCase();
  const snakeName = lodash.snakeCase(safeCharName);

  const max = 10000000;
  const min = 1000;
  return snakeName + '-' + String(Math.floor(Math.random() * (max - min)) + min);
}

/**
 * Generates a random value.
 *
 * @returns {number}
 */
export function flipCoin() {
  const min = 1;
  const max = 2147483646;
  return Math.floor(Math.random() * (max - min)) + min;
}
