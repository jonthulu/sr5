import dotEnv from 'dotenv';
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';

import commonConfig from './webpack.common.js';
import helpers from './helpers.js';

import path from 'path';

/**
 * Webpack Plugins
 */
import WebpackMd5Hash from 'webpack-md5-hash';
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
  'process.env': {
    'HOST': JSON.stringify(process.env.HOST),
    'PORT': JSON.stringify(process.env.PORT),
    'BACKEND_URL': JSON.stringify(process.env.BACKEND_URL),
    'NODE_ENV': JSON.stringify('production'),
  },
  __DEV__: false,
};

export default webpackMerge(commonConfig, {
  debug: true,

  // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps
  // and https://webpack.github.io/docs/configuration.html#devtool
  devtool: 'source-map',

  noInfo: true, // set to false to see a list of every file being bundled.
  entry: './src/index',
  target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  plugins: [
    // Hash the files using MD5 so that their names change when the content changes.
    new WebpackMd5Hash(),

    // Optimize the order that items are bundled. This assures the hash is deterministic.
    new webpack.optimize.OccurenceOrderPlugin(),

    // Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
    new webpack.DefinePlugin(GLOBALS),

    // Generate HTML file that contains references to generated bundles.
    // See here for how this works: https://github.com/ampedandwired/html-webpack-plugin#basic-usage
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
      // Note that you can add custom options here if you need to handle other custom logic in index.html
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
    }),

    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, '../src/sw.js'),
      excludes: [
        '**/.*',
        '**/*.map',
        '*.html',
      ],
    }),

    // Eliminate duplicate packages when generating bundle
    new webpack.optimize.DedupePlugin(),

    // Minify JS
    new webpack.optimize.UglifyJsPlugin(),
  ],
});
