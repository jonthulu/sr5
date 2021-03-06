/* eslint-disable no-process-env, no-magic-numbers */

import env from './env.js';

const setupVars = process.env || {};

export default {
  env: env,
  host: setupVars.HOST || 'https://0.0.0.0',
  port: setupVars.PORT || 3060,

  server: {
    baseUrl: setupVars.BACKEND_URL || 'https://0.0.0.0:3061',
  }
};
