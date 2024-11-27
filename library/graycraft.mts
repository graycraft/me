/**!
 * Methods for Graycraft logotype drawing on the server.
 *
 * @module library/graycraft
 */

export const SIZE: number = 360;

/**
 * Draw shapes on SVG element (server only).
 * @param {() => {
 *   hsl: string;
 *   pathCraft: string;
 *   pathGray: string;
 *   sizeHalf: string;
 *   translateY: number;
 * }} drawSvg Draw shapes function to get parameters.
 * @returns {string} Inner SVG template.
 */
const fillSvg = (
  drawSvg: () => {
    hsl: string;
    pathCraft: string;
    pathGray: string;
    sizeHalf: string;
    translateY: number;
  },
) => {
  const { hsl, pathCraft, pathGray, sizeHalf, translateY } = drawSvg(),
    template = `SVG is not supported by your browser.
      <title>Graycraft</title>
      <!-- circle cx="${sizeHalf}" cy="${sizeHalf}" fill="white" r="${sizeHalf}"></circle -->
      <g transform="translate(0, ${translateY})">
        <path
          d="${pathGray}"
          fill="${hsl}"
        ></path>
        <path
          d="${pathCraft}"
          fill="black"
        ></path>
      </g>`;

  return template;
};

export default fillSvg;
