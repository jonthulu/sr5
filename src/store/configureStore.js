/* eslint-disable global-require */

import mainConfig from '../config/main.js';

if (mainConfig.env === 'production') {
  module.exports = require('./configureStore.prod');
} else {
  module.exports = require('./configureStore.dev');
}
