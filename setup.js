'use strict';

/**
 * Script to help do all initial setup for this project.
 */

/* eslint-disable no-magic-numbers, no-console */

const fs = require('fs');
const inquirer = require('inquirer');
const lodash = require('lodash');
const path = require('path');

/**
 * The path to the .env file.
 * @type {string}
 */
const ENV_FILE_PATH = path.join(__dirname, '/.env');

// Step 1: Create/Update the .env file.
console.log('Answer questions to save project setup information.');
getCurrentEnvFile().then(
  askForEnvFileDataa
).then(
  overwriteEnvFile
).then(() => {
  console.log('.env file written.');
  console.log('SETUP COMPLETE.');
}).catch((processError) => {
  console.error(processError);
});

/**
 * Reads the contents of a file.
 *
 * @param {string} filePath
 * @returns {Promise<string>}
 */
function getFileContents(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, fileData) => {
      if (err) {
        return reject(err);
      }

      return resolve(fileData);
    });
  });
}

/**
 * Writes (overwrites) the contents to a file.
 *
 * @param {string} filePath
 * @param {string} fileContents
 * @returns {Promise<string>}
 */
function writeFileContents(filePath, fileContents) {
  const writeOptions = {
    encoding: 'utf8',
    flag: 'w'
  };

  return new Promise((resolve, reject) => {
    console.log('writing to', filePath);
    fs.writeFile(filePath, fileContents, writeOptions, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve(filePath);
    });
  });
}

/**
 * Gets the contents of the current env file.
 *
 * @returns {Promise<{}>}
 */
function getCurrentEnvFile() {
  return getFileContents(ENV_FILE_PATH).then((envFileData) => {
    return envFileData.trim().split(/[\s\n]/).reduce((allEnvs, nameAndValue) => {
      const nameAndValueParts = nameAndValue.split('=');
      if (nameAndValueParts.length === 2 && nameAndValueParts[1]) {
        allEnvs[nameAndValueParts[0]] = nameAndValueParts[1];
      }

      return allEnvs;
    }, {});
  });
}

/**
 * Asks the user for environment file values.
 *
 * @param {{}} currentEnv
 * @returns {Promise<Object>}
 */
function askForEnvFileData(currentEnv) {
  const prompts = [
    {
      type: 'input',
      name: 'BACKEND_URL',
      message: 'The host domain where the backend code is running (With protocol)',
      default: currentEnv.BACKEND_URL || 'http://0.0.0.0:3061'
    }, {
      type: 'input',
      name: 'HOST',
      message: 'The host where this code is running (No protocol)',
      default: currentEnv.HOST || '0.0.0.0'
    }, {
      type: 'input',
      name: 'PORT',
      message: 'The port where this code is running',
      default: currentEnv.PORT || 3060
    }
  ];

  return inquirer.prompt(prompts).then((answers) => {
    return Object.assign({}, currentEnv, answers);
  });
}

/**
 * Writes new env contents to the .env file.
 *
 * @param {string|object} newContents
 * @returns {Promise<boolean>}
 */
function overwriteEnvFile(newContents) {
  let stringContents = '';
  if (typeof newContents === 'string') {
    stringContents = newContents;
  } else {
    stringContents = lodash.reduce(newContents, (contents, envValue, envName) => {
      contents.push(`${envName}=${envValue}`);
      return contents;
    }, []).join('\n');
  }

  return writeFileContents(ENV_FILE_PATH, stringContents);
}
