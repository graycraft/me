/**!
 * Constants library for common usage.
 *
 * @typedef {keyof HTTP["STATUS"]} HttpStatusText
 * @module library/constants
 */

/**
 * @type {{
 *   STATUS: {
 *     INTERNAL_SERVER_ERROR: { CODE: 500, TEXT: string };
 *     NOT_FOUND: { CODE: 404, TEXT: string };
 *   };
 * }}
 */
export const HTTP = {
  STATUS: {
    INTERNAL_SERVER_ERROR: {
      CODE: 500,
      TEXT: 'Internal Server Error',
    },
    NOT_FOUND: {
      CODE: 404,
      TEXT: 'Not Found',
    },
  },
};
