// This script removes demo app files
import rimraf from 'rimraf';
import fs from 'fs';
import {chalkSuccess} from './chalkConfig.js';

/* eslint-disable no-console */

const pathsToRemove = [
  './src/actions/*',
  './src/utils',
  './src/components/*',
  './src/constants/*',
  './src/containers/*',
  './src/images',
  './src/reducers/*',
  './src/store/store.spec.js',
  './src/styles',
  './src/routes.js',
  './src/index.js',
];

const filesToCreate = [
  {
    path: './src/components/emptyTest.spec.js',
    content: '// Must have at least one test file in this directory or Mocha will throw an error.',
  },
  {
    path: './src/index.js',
    content: '// Set up your application entry point here...',
  },
  {
    path: './src/reducers/index.js',
    content: '// Set up your root reducer here...\n'
      + 'import { combineReducers } from \'redux\';\n export default combineReducers;',
  },
];

/**
 * Removes the given path.
 *
 * @param {string} path
 * @param {function} callback
 * @throws {Error} If remove path error occurs.
 */
function removePath(path, callback) {
  rimraf(path, error => {
    if (error) {
      throw new Error(error);
    }
    callback();
  });
}

/**
 * Creates the file.
 *
 * @param {Object} file
 * @throws {Error} If file creation error occurs.
 */
function createFile(file) {
  fs.writeFile(file.path, file.content, error => {
    if (error) {
      throw new Error(error);
    }
  });
}

let numPathsRemoved = 0;
pathsToRemove.map(path => {
  removePath(path, () => {
    numPathsRemoved += 1;
    if (numPathsRemoved === pathsToRemove.length) { // All paths have been processed
      // Now we can create files since we're done deleting.
      filesToCreate.map(file => createFile(file));
    }
  });
});

console.log(chalkSuccess('Demo app removed.'));
