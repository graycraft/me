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
    STATUS: { INTERNAL_SERVER_ERROR, NOT_FOUND },
  } = HTTP,
  __filename = fileURLToPath(import.meta.url),
  __dirname = nodePath.dirname(__filename),
  app: Express = express();

app.set('views', nodePath.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(nodePath.join(__dirname, 'public')));
app.use('/', routerIndex);

/**
 * Catch HTTP status code 404 and forward to the error handler.
 */
app.use(((req, res, next) => {
  next(createError(NOT_FOUND.CODE));
}) as RequestHandler);

/**
 * Error handler.
 */
app.use(((error, req, res, next) => {
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
    { getYear, hsl, hslLight, rgb } = graycraft(size, fore, back),
    status: number = error.status || INTERNAL_SERVER_ERROR.CODE;

  /** Set locals, only providing error in development mode. */
  res.locals.message = error?.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};
  res.status(status);
  res.render('error', {
    back,
    css,
    externalLink,
    host,
    header: status,
    hsl,
    hslLight,
    imagePath: 'images/graycraft-cotd.png',
    paragraph:
      ({
        404: 'This page is not found on the server',
        500: 'An error occurred on the server',
      }[status] ?? 'Unknown error') + '.',
    rgb,
    size,
    title: Object.values(HTTP.STATUS).find(({ CODE }) => CODE === status)?.TEXT ?? 'Error',
    year: getYear(),
  });
}) as ErrorRequestHandler);

export default app;
