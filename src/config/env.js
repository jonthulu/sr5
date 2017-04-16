/* eslint-disable no-process-env */

const setupVars = process.env || {};

export default (function getNodeEnvironment() {
  switch (setupVars.NODE_ENV) {
    case 'production':
      return 'production';

    case 'testing':
      return 'testing';

    default:
      return 'development';
  }
})();
