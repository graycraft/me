/**
 * Generated using `webpack-cli`.
 *
 * @see https://github.com/webpack/webpack-cli
 */

'use strict';

import nodePath from 'node:path';

import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import WorkboxWebpackPlugin from 'workbox-webpack-plugin';

import type { Configuration } from 'webpack';

const isProduction = process.env.NODE_ENV === 'production',
  config: Configuration = {
    devtool: 'source-map',
    entry: './source/index.mjs',
    module: {
      rules: [
        /** @see https://webpack.js.org/loaders */
        {
          exclude: ['/node_modules/'],
          loader: 'ts-loader',
          test: /\.(mts|ts)$/i,
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(eot|gif|jpg|png|svg|ttf|woff|woff2)$/i,
          type: 'asset',
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [new CssMinimizerWebpackPlugin(), new TerserWebpackPlugin()],
    },
    output: {
      filename: 'graycraft.umd.js',
      /** Solves "Uncaught ReferenceError: self is not defined". */
      globalObject: 'this',
      library: {
        name: 'graycraft',
        type: 'umd',
      },
      path: nodePath.resolve(__dirname, 'distribution'),
    },
    /** @see https://webpack.js.org/configuration/plugins */
    plugins: [new MiniCssExtractPlugin()],
    resolve: {
      extensions: ['.js', '.mjs', '.mts', '.ts', '...'],
    },
  };

export default () => {
  if (isProduction) {
    config.mode = 'production';
    config.plugins?.push(new WorkboxWebpackPlugin.GenerateSW());
  } else config.mode = 'development';

  return config;
};
