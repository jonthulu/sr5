import dotEnv from 'dotenv';
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';

import commonConfig from './webpack.common.js';
import helpers from './helpers.js';

import path from 'path';

/**
 * Webpack Plugins
 */
import HtmlWebpackPlugin from 'html-webpack-plugin';
import PwaManifestWebpackPlugin from 'pwa-manifest-webpack-plugin';
import ServiceWorkerWebpackPlugin from 'serviceworker-webpack-plugin';

/**
 * Load the ENV file before doing anything else.
 */
dotEnv.config();

/**
 * Webpack Config
 */
const GLOBALS = {
  'process.env' : {
    'HOST': JSON.stringify(process.env.HOST),
    'PORT': JSON.stringify(process.env.PORT),
    'BACKEND_URL': JSON.stringify(process.env.BACKEND_URL),
    'NODE_ENV': JSON.stringify('development'),
  },
  __DEV__: true,
};

const isSecure = Boolean(process.env.IS_SECURE && process.env.IS_SECURE !== '0' && process.env.IS_SECURE !== 'false');

export default webpackMerge(commonConfig, {
  debug: true,

  // More info: https://webpack.github.io/docs/build-performance.html#sourcemaps and
  // https://webpack.github.io/docs/configuration.html#devtool
  devtool: 'eval-source-map',

  // Set to false to see a list of every file being bundled.
  noInfo: true,

  entry: {
    main: [
      helpers.root('src/webpack-public-path'),
      'webpack-hot-middleware/client?reload=true',
      helpers.root('src/index.js'), // Defining path seems necessary for this to work consistently on Windows machines.
    ],
  },

  // Necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  target: 'web',

  output: {
    // Note: Physical files are only output by the production build task `npm run build`.
    path: helpers.root('dist'),

    // Use absolute paths to avoid the way that URLs are resolved by Chrome when they're parsed from a
    // dynamically loaded CSS blob. Note: Only necessary in Dev.
    publicPath: `http${(isSecure) ? 's' : ''}://0.0.0.0:${process.env.PORT}/`,

    filename: '[name].bundle.js',

    sourceMapFilename: '[name].map',

    chunkFilename: '[id].chunk.js',
  },

  plugins: [
    // Tells React to build in prod mode.
    // https://facebook.github.io/react/downloads.html
    new webpack.DefinePlugin(GLOBALS),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),

    // Create HTML file that includes references to bundled CSS and JS.
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
      inject: true,
    }),

    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, '../src/sw.js'),
      excludes: [
        '**/.*',
        '**/*.map',
        '*.html',
      ],
    }),

    new PwaManifestWebpackPlugin({
      name: 'SR5Init',
      description: 'Shadowrun 5th Initiative Tracker',
      start_url: 'index.html',
      display: 'standalone',
      background_color: '#fff',
      description: 'Let\'s track some SR5 initiative',
      icon: {
        src: path.resolve('src/images/appicon.png'),
        sizes: [36, 48, 192]
      }
    })
  ],
});
