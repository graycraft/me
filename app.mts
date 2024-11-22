/**
 * This file:
 * 1. Migrated from CJS module to ESM.
 * 2. Defined with appropriate TS types.
 * 3. Moved from legacy `./app.js` to `./app.mts` to run development server and compile for production.
 *
 * @module app
 */

import type { Express, ErrorRequestHandler, RequestHandler } from 'express';

import nodePath from 'node:path';
import { fileURLToPath } from 'node:url';

import cookieParser from 'cookie-parser';
import express from 'express';
import createError from 'http-errors';
import logger from 'morgan';

import { HTTP } from './library/constants.mts';
import routerIndex from './routes/index.mts';

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
  next(createError(404));
}) as RequestHandler);

/**
 * Error handler.
 */
app.use(((error, req, res) => {
  /** Set locals, only providing error in development. */
  res.locals.message = error?.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};

  res.status(error.status || INTERNAL_SERVER_ERROR);
  res.render('error');
}) as ErrorRequestHandler);

export default app;