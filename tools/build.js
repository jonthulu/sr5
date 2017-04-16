// More info on Webpack's Node API here: https://webpack.github.io/docs/node.js-api.html
// Allowing console calls below since this is a build file.
/* eslint-disable no-console */
import webpack from 'webpack';

import config from '../config/webpack.prod.js';
import {chalkError, chalkSuccess, chalkWarning, chalkProcessing} from './chalkConfig.js';

// This assures React is built in prod mode and that the Babel dev config doesn't apply.
process.env.NODE_ENV = 'production'; // eslint-disable-line no-process-env

console.log(chalkProcessing('Generating minified bundle. This will take a moment...'));

webpack(config).run((err, stats) => {
  if (err) { // so a fatal error occurred. Stop here.
    console.log(chalkError(err));
    return 1;
  }

  const jsonStats = stats.toJson();

  if (jsonStats.hasErrors) {
    return jsonStats.errors.map(mapErr => console.log(chalkError(mapErr)));
  }

  if (jsonStats.hasWarnings) {
    console.log(chalkWarning('Webpack generated the following warnings: '));
    jsonStats.warnings.map(warning => console.log(chalkWarning(warning)));
  }

  console.log(`Webpack stats: ${stats}`);

  // if we got this far, the build succeeded.
  console.log(chalkSuccess('Your app is compiled in production mode in /dist. It\'s ready to roll!'));

  return 0;
});
