/**!
 * Constants library for common usage.
 *
 * @typedef {keyof HTTP["STATUS"]} HttpStatusText
 * @module library/constants
 */

/**
 * @type {{
 *   STATUS: {
 *     INTERNAL_SERVER_ERROR: 500;
 *   };
 * }}
 */
export const HTTP = {
  STATUS: {
    INTERNAL_SERVER_ERROR: 500,
  },
};
