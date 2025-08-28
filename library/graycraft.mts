/**!
 * Methods for Graycraft logotype drawing on the server.
 *
 * @typedef {import("source/graycraft.umd.js").RSvg} RSvg
 * @module library/graycraft
 */

import { compile } from 'pug';

export const SIZE: number = 480;
export const SIZE_MIN: number = 256;

/**
 * Draw shapes on SVG element (server only).
 * @param {() => RSvg} drawSvg Draw shapes function to get parameters.
 * @returns {string} Compiled Pug template with SVG.
 */
const templateSvg = (
  drawSvg: () => {
    back: string;
    defCraft: string;
    defGray: string;
    hsl: string;
    round: boolean;
    size: string;
    sizeHalf: string;
    translateY: number;
  },
) => {
  const { back, defCraft, defGray, hsl, round, size, sizeHalf, translateY } = drawSvg(),
    /** Setting height keeps empty space at the top and bottom of a scaled SVG image. */
    template = compile(
      `svg(
        class="logotype"
        onerror="'use strict'; console.error('Can not load the SVG:', this);"
        preserveAspectRatio="xMidYMid meet"
        style="background-color: ${round ? 'transparent' : back};"
        viewBox="0 0 ${size} ${size}"
        width="${size}"
      )
          defs
            title="Graycraft"
            desc="SVG is not supported by your browser."
            filter(
              color-interpolation-filters="sRGB"
              id="shadow"
            )
              feDropShadow(
                dx="16.666667"
                dy="10"
                flood-color="black"
                flood-opacity="0.5"
                stdDeviation="5"
              )
          ${
            round
              ? `circle(
                  cx="${sizeHalf}"
                  cy="${sizeHalf}"
                  fill="${back}"
                  r="${sizeHalf}"
                )`
              : ''
          }
          g(
            filter="url(#shadow)"
            transform="translate(0, ${translateY})"
          )
            path(
              d="${defGray}"
              fill="${hsl}"
            )
            path(
              d="${defCraft}"
              fill="black"
            )`,
    );

  return template();
};

export default templateSvg;
