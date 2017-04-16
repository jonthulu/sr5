import autoPrefixer from 'autoprefixer';

import helpers from './helpers.js';

/**
 * Webpack Plugins
 */
import ExtractTextPlugin from 'extract-text-webpack-plugin';

/**
 * Webpack Config
 */
export default {
  resolve: {
    // An array of extensions that should be used to resolve modules.
    extensions: ['', '.js', '.jsx'],

    // Make sure root is the src directory.
    root: helpers.root('src'),

    // Remove the other default values
    modulesDirectories: ['node_modules'],
  },

  externals: {
    document: 'document'
  },

  plugins: [
    // Generate an external css file with a hash in the filename
    new ExtractTextPlugin('[name].[contenthash].css')
  ],

  module: {
    loaders: [
      {
        // Loaders for javascript.
        test: /\.jsx?$/,
        include: helpers.root('src'),
        loaders: ['babel'],
      }, {
        // Loaders for SASS.
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css?sourceMap!postcss!sass?sourceMap'),
      }, {
        // Loaders for CSS.
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css?sourceMap!postcss'),
      }, {
        test: /\.eot(\?v=\d+.\d+.\d+)?(\?[^\/]*)?$/,
        loader: 'file',
      }, {
        test: /\.woff2?(\?v=\d+.\d+.\d+)?(\?[^\/]*)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff',
      }, {
        test: /\.ttf(\?v=\d+.\d+.\d+)?(\?[^\/]*)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream',
      }, {
        test: /\.svg(\?v=\d+.\d+.\d+)?(\?[^\/]*)?$/,
        loader: 'file?limit=10000&mimetype=image/svg+xml',
      }, {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'file?name=[name].[ext]',
      }, {
        test: /\.ico$/,
        loader: 'file?name=[name].[ext]',
      }, {
        // Inject jQuery into 3rd party dependencies.
        test: /foundation(\.min)?\.js$/,
        loader: 'imports?jQuery=jquery',
      }
    ]
  },

  postcss: function postCssPlugins() {
    return [
      autoPrefixer({browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']})
    ];
  },

  sassLoader: {
    includePaths: [
      helpers.root('node_modules/'),
      helpers.root('src/styles/'),
    ]
  }
};
