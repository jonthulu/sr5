// This file configures a web server for testing the production build
// on your local machine.

import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback';

import {chalkProcessing} from './chalkConfig.js';

/* eslint-disable no-console */

console.log(chalkProcessing('Opening production build...'));

const port = process.env.PORT || 3060;

// Run Browsersync
browserSync({
  port: port,
  ui: {
    port: port + 1,
  },
  server: {
    baseDir: 'dist',
  },

  files: [
    'src/*.html',
  ],

  middleware: [historyApiFallback()],
});
