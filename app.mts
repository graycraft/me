/**
 * This file:
 * 1. Migrated from CJS module to ESM.
 * 2. Defined with appropriate TS types.
 * 3. Moved from legacy `./app.js` to `./app.mts` to run development server and compile for production.
 *
 * @module app
 */

import type { Express, ErrorRequestHandler, RequestHandler } from 'express';

import nodeFs from 'node:fs';
import nodePath from 'node:path';
import { fileURLToPath } from 'node:url';

import cookieParser from 'cookie-parser';
import express from 'express';
import createError from 'http-errors';
import logger from 'morgan';

import { HTTP } from './library/constants.mts';
import { SIZE, SIZE_MIN } from './library/graycraft.mts';
import routerIndex from './routes/index.mts';
import graycraft from './source/graycraft.umd.js';

const {
    STATUS: { INTERNAL_SERVER_ERROR },
  } = HTTP,
  __filename = fileURLToPath(import.meta.url),
  __dirname = nodePath.dirname(__filename),
  app: Express = express();

app.set('views', nodePath.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(nodePath.join(__dirname, 'public')));
app.use('/', routerIndex);

/**
 * Catch 404 and forward to error handler.
 */
app.use(((req, res, next) => {
  const { DEPLOYMENT, HOSTNAME, PORT, PORT_PROXY } = process.env,
    externalLinkBuffer = nodeFs.readFileSync('public/images/external_link.svg'),
    externalLink = global.encodeURIComponent(String(externalLinkBuffer)),
    host = HOSTNAME + ':' + (DEPLOYMENT === 'local' ? PORT : PORT_PROXY),
    cssBuffer = nodeFs.readFileSync('public/stylesheets/style.css'),
    css = String(cssBuffer),
    { back: backQuery, fore: foreQuery, size: sizeQuery } = req.query,
    back = String(backQuery ?? 'transparent'),
    fore = String(foreQuery ?? ''),
    size = Number(sizeQuery ?? SIZE) < SIZE_MIN ? SIZE_MIN : Number(sizeQuery ?? SIZE),
    { getYear, hsl, hslLight, rgb } = graycraft(size, fore, back);

  res.render('404', {
    back,
    css,
    externalLink,
    host,
    header: '404',
    hsl,
    hslLight,
    imagePath: 'images/graycraft.png',
    paragraph: 'This page is not found on the server.',
    rgb,
    size,
    title: 'Not Found',
    year: getYear(),
  });
  next(createError(404));
}) as RequestHandler);

/**
 * Error handler.
 */
app.use(((error, req, res) => {
  /** Set locals, only providing error in development mode. */
  res.locals.message = error?.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};

  res.status(error.status || INTERNAL_SERVER_ERROR);
  res.render('error');
}) as ErrorRequestHandler);

export default app;
