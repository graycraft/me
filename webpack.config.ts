/**
 * Generated using `webpack-cli`.
 *
 * @see https://github.com/webpack/webpack-cli
 */

'use strict';

import nodePath from 'node:path';

import WorkboxWebpackPlugin from 'workbox-webpack-plugin';

import type { Configuration } from 'webpack';

const isProduction = process.env.NODE_ENV === 'production',
  stylesHandler = 'style-loader',
  config: Configuration = {
    devtool: 'source-map',
    entry: './source/graycraft.mjs',
    output: {
      filename: 'graycraft.umd.js',
      /** Prevents "Uncaught ReferenceError: self is not defined". */
      globalObject: 'this',
      library: {
        name: 'graycraft',
        type: 'umd',
      },
      path: nodePath.resolve(__dirname, 'public/javascripts'),
    },
    /** @see https://webpack.js.org/configuration/plugins */
    plugins: [],
    module: {
      rules: [
        /** @see https://webpack.js.org/loaders */
        {
          exclude: ['/node_modules/'],
          loader: 'ts-loader',
          test: /\.(ts|tsx)$/i,
        },
        {
          test: /\.css$/i,
          use: [stylesHandler, 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(eot|gif|jpg|png|svg|ttf|woff|woff2)$/i,
          type: 'asset',
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '...'],
    },
  };

export default () => {
  if (isProduction) {
    config.mode = 'production';
    config.plugins?.push(new WorkboxWebpackPlugin.GenerateSW());
  } else config.mode = 'development';

  return config;
};
