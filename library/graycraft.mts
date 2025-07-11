/**!
 * Methods for Graycraft logotype drawing on the server.
 *
 * @typedef {import("source/graycraft.umd.js").RSvg} RSvg
 * @module library/graycraft
 */

export const SIZE: number = 480;
export const SIZE_MIN: number = 256;

/**
 * Draw shapes on SVG element (server only).
 * @param {() => RSvg} drawSvg Draw shapes function to get parameters.
 * @returns {string} SVG template.
 */
const templateSvg = (
  drawSvg: () => {
    back: string;
    hsl: string;
    pathCraft: string;
    pathGray: string;
    round: boolean;
    size: string;
    sizeHalf: string;
    translateY: number;
  },
) => {
  const { back, hsl, pathCraft, pathGray, round, size, sizeHalf, translateY } = drawSvg(),
    /** Setting height keeps empty space at the top and bottom of a scaled SVG image. */
    template = `<svg
      class="logotype"
      ${/* height="" */ ''}
      onerror="'use strict'; console.error('Can not load the SVG:', this);"
      preserveAspectRatio="xMidYMid meet"
      style="background-color: ${round ? 'transparent' : back};"
      viewBox="0 0 ${size} ${size}"
      width="${size}"
    >
      <title>Graycraft</title>
      <desc>SVG is not supported by your browser.</desc>
      ${round ? `<circle cx="${sizeHalf}" cy="${sizeHalf}" fill="${back}" r="${sizeHalf}"></circle>` : ''}
      <g transform="translate(0, ${translateY})">
        <path
          d="${pathGray}"
          fill="${hsl}"
        ></path>
        <path
          d="${pathCraft}"
          fill="black"
        ></path>
      </g>
    </svg>`;

  return template;
};

export default templateSvg;
