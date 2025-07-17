/**
 * This file:
 * 1. Migrated from CJS module to ESM.
 * 2. Defined with appropriate TS types.
 * 3. Moved from legacy `./bin/www` to `./index.mts` to run development server and compile for production.
 *
 * @module index
 */

import debug from 'debug';

import nodeHttp from 'node:http';

import app from './app.mts';

const debugServer = debug('me:server'),
  port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

const server = nodeHttp.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * @see https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html#graceful-shutdown
 */
process.on('SIGTERM', () => {
  debugServer('SIGTERM signal received: closing HTTP server');
  server.close(() => debugServer('HTTP server closed'));
});

/**
 * Normalize a port into a number, string, or false.
 * @param {string} value Value of port from environment variable.
 * @returns {false | number | string} Named pipe, port number or `false`.
 */
function normalizePort(value: string) {
  const port = Number.parseInt(value);

  /** Named pipe. */
  if (Number.isNaN(port)) return value;
  /** Port number. */
  if (port >= 0) return port;

  return false;
}

/**
 * Event listener for Node.js HTTP server "error" event.
 * @param {NodeJS.ErrnoException} error Server error object.
 */
function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  /** Handle specific listen errors with friendly messages. */
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address(),
    bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;

  debug('Listening on ' + bind);
}
