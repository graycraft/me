/**!
 * Generate Graycraft logotype with different methods to choose from.
 *
 * @see https://github.com/umdjs/umd/blob/master/templates/returnExports.js#L40
 * @see https://npm.im/canvas
 * @see https://requirejs.org/docs/whyamd.html
 * @typedef {import("canvas/types").Canvas} Canvas
 * @typedef {{ x: number, y: number }[]} coords
 * @typedef {(width: number, height: number, type?: "pdf" | "svg") => Canvas} createCanvas
 * @typedef {{
 *   back: string;
 *   hsl: string;
 *   pathCraft: string;
 *   pathGray: string;
 *   round: boolean;
 *   size: string;
 *   sizeHalf: string;
 *   translateY: number;
 * }} RSvg
 * @typedef {{
 *   drawCanvas: (createCanvas: createCanvas) => Canvas;
 *   drawSvg: () => RSvg;
 *   getYear: (date?: Date) => number;
 *   hsl: string;
 *   hslLight: string;
 *   hslToRgb: (h: number, s: number, l: number) => number[];
 *   hue: number;
 *   renderImage: (canvas: Canvas & HTMLCanvasElement) => {
 *     buffer?: Buffer;
 *     dataUrl?: string;
 *   };
 *   rgb: string;
 *   size: number;
 * }} RFactory
 * @typedef {(size: number, fore: string, back: string, round?: boolean) => RFactory} factory
 * @typedef {(( Window & typeof globalThis ) | factory) & { Graycraft?: factory; }} root
 * @module source/graycraft.umd
 */

'use strict';

var root = typeof self !== 'undefined' ? self : this;

// prettier-ignore
(
  /**
   * UMD module that works in browser, server, AMD and other JS environments.
   * @param {root} root Global root object (`window` in browsers, `global` in Node.js, etc.).
   * @param {(
   *   root: root & { size?: number; }
   * ) => factory} factory Factory function returning public methods and properties.
   */
  function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      define([], factory);
    } else if (typeof module === 'object' && module.exports) {
      module.exports = factory(root);
    } else {
      root.Graycraft = factory(root);
    }
  }
)(root, function (root) {
  /**
   * Factory function returning public methods and properties.
   * @param {number} size Height or width of logotype.
   * @param {string} fore Foreground color of logotype.
   * @param {string} back Background color of logotype.
   * @param {boolean} [round] Whether to apply round background to logotype or not.
   * @returns {RFactory} Public methods and properties.
   */
  return function graycraft(size, fore, back, round) {
    var dx = size / 4,
      dy = ((size / 4) * Math.sqrt(3)) / 2,
      gray = getCoordinates('gray', dx, dy),
      craft = getCoordinates('craft', dx, dy),
      hue = daysToHue(daysInYear(new Date())),
      hsl = fore || 'hsl(' + hue + ', 50%, 50%)',
      hslLight = fore || 'hsl(' + hue + ', 93.75%, 93.75%)',
      rgb = '#' + hslToRgb(hue / 360, .5, .5).map(value => value.toString(16)).join('');

    return {
      drawCanvas,
      drawSvg,
      getYear,
      hsl,
      hslLight,
      hslToRgb,
      hue,
      renderImage,
      rgb,
      size,
    };

    /**
     * Calculate amount of days passed since the beginning of the year.
     * @param {Date} date Current date.
     * @returns {number} Amount of days.
     */
    function daysInYear(date) {
      var epochBegin = Date.UTC(getYear(date), 0, 0),
        epochNow = Date.UTC(getYear(date), date.getMonth(), date.getDate());

      return (epochNow - epochBegin) / 24 / 60 / 60 / 1000;
    }

    /**
     * Translate days passed since the beginning of the year to the color hue.
     * @param {number} days Amount of days.
     * @returns {number} Color hue.
     */
    function daysToHue(days) {
      var daysMax = getYear() % 4 === 0 ? 366 : 365,
        hueMax = 360,
        shift = hueMax / 3,
        hueDays = Math.round((days / daysMax) * hueMax),
        hueInverted = hueMax - hueDays,
        hueShifted = hueInverted - shift,
        hue = hueShifted <= 0 ? hueInverted + (hueMax - shift) : hueShifted;

      return hue;
    }

    /**
     * Draw shapes on canvas using HTML element (browser) or virtually with `canvas` NPM package using Cairo (server).
     * @param {createCanvas} createCanvas
     */
    function drawCanvas(createCanvas) {
      var canvas = createCanvas
          ? createCanvas(size, size)
          : /** @type {Canvas & HTMLCanvasElement} */ (document.getElementById('logo-canvas')),
        ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.fillStyle = back;
        ctx.lineJoin = 'round';
        ctx.lineWidth = Number.EPSILON;
        ctx.scale(1 / (size / canvas.width), 1 / (size / canvas.height));
        ctx.beginPath();
        if (round) {
          ctx.ellipse(size / 2, size / 2, size / 2, size / 2, 0, 0, 2 * Math.PI);
        } else {
          ctx.fillRect(0, 0, size, size);
        }
        ctx.closePath();
        ctx.fill();
        ctx.translate(0, (size - dy * 4) / 2);
      }
      shape(gray, hsl);
      shape(craft, 'black');

      return canvas;

      /**
       * Draw specified shape ("gray" or "craft") on canvas.
       * @param {{ x: number, y: number }[]} coords Coordinates to draw a specified shape.
       * @param {"black" | string} color Shape fill style color.
       */
      function shape(coords, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(coords[0].x, coords[0].y);
        for (var i = 1; i < coords.length; i++) {
          ctx.lineTo(coords[i].x, coords[i].y);
        }
        ctx.closePath();
        ctx.fill();
      }
    }

    /**
     * Draw shapes on SVG element (client browser only).
     * @returns {RSvg} Parameters with which SVG were drawn, to replicate on the server.
     */
    function drawSvg() {
      var sizeHalf = String(size / 2),
        translateY = (size - dy * 4) / 2;

      if (typeof document === 'object') {
        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle'),
          group = document.createElementNS('http://www.w3.org/2000/svg', 'g'),
          title = document.createElementNS('http://www.w3.org/2000/svg', 'title'),
          svg = document.getElementById('logo-svg');

        if (round) {
          circle.setAttribute('cx', sizeHalf);
          circle.setAttribute('cy', sizeHalf);
          circle.setAttribute('fill', back);
          circle.setAttribute('r', sizeHalf);
        }
        group.setAttribute('transform', `translate(0, ${translateY})`);
        title.textContent = 'Graycraft';
        if (svg) {
          svg.prepend(title);
          if (round) {
            svg.appendChild(circle);
          } else {
            svg.style.setProperty('background-color', back);
          }
          svg.appendChild(group);
        }

        var pathGray = shape(gray, hsl),
          pathCraft = shape(craft, 'black');

        /**
         * Draw specified shape ("gray" or "craft") on canvas.
         * @param {coords} coords Coordinates to draw a specified shape.
         * @param {"black" | string} color Shape fill style color.
         * @returns {string} Path drawn.
         */
        function shape(coords, color) {
          var path = document.createElementNS('http://www.w3.org/2000/svg', 'path'),
            draw = `M${coords[0].x} ${coords[0].y}`;

          for (var i = 1; i < coords.length; i++) {
            draw += ` L${coords[i].x} ${coords[i].y}`;
          }
          path.setAttribute('d', draw + ' Z');
          path.setAttribute('fill', color);
          group.appendChild(path);

          return draw;
        }
      } else {
        var pathGray = shape(gray),
          pathCraft = shape(craft);

        /**
         * Draw specified shape ("gray" or "craft") on canvas.
         * @param {coords} coords Coordinates to draw a specified shape.
         * @returns {string} Path to draw on the server.
         */
        function shape(coords) {
          var draw = `M${coords[0].x} ${coords[0].y}`;

          for (var i = 1; i < coords.length; i++) {
            draw += ` L${coords[i].x} ${coords[i].y}`;
          }

          return draw;
        }
      }

      return {
        back,
        hsl,
        pathCraft,
        pathGray,
        round: round || false,
        size: String(size),
        sizeHalf,
        translateY,
      };
    }

    /**
     * Get coordinates to draw a specified shape on canvas, image or SVG elements.
     * @param {"craft" | "gray"} shape Name of the shape whose coordinates need to be returned.
     * @param {number} dx X-dimension which is a quarter of logotype size.
     * @param {number} dy Y-dimension which is a quarter of logotype size.
     * @returns {coords} Coordinates to draw a specified shape.
     */
    function getCoordinates(shape, dx, dy) {
      var coords = {
        gray: [
          {
            x: 0,
            y: dy * 2,
          },
          {
            x: dx,
            y: dy * 2,
          },
          {
            x: dx * 2,
            y: dy * 4,
          },
          {
            x: dx,
            y: dy * 4,
          },
        ],
        craft: [
          {
            x: dx,
            y: 0,
          },
          {
            x: dx * 3,
            y: 0,
          },
          {
            x: dx * 3 + dx / 2,
            y: dy,
          },
          {
            x: dx * 3,
            y: dy * 2,
          },
          {
            x: dx * 3 + dx / 2,
            y: dy * 3,
          },
          {
            x: dx * 2 + dx / 2,
            y: dy * 3,
          },
          {
            x: dx * 2,
            y: dy * 2,
          },
          {
            x: dx * 3 - dx / 2,
            y: dy,
          },
          {
            x: dx + dx / 2,
            y: dy,
          },
        ],
      }[shape];

      return coords;
    }

    /**
     * Get full year for provided date according to universal time.
     * @param {Date} [date] Date to get year from.
     * @returns Year for provided date according to universal time.
     */
    function getYear(date) {
      var year = (date || new Date()).getUTCFullYear();

      return year;
    }

    /**
     * Converts an HSL color model to RGB representation.
     * @see http://en.wikipedia.org/wiki/HSL_color_space
     * @param {number} hue Hue.
     * @param {number} saturation Saturation.
     * @param {number} lightness Lightness.
     * @return {number[]} RGB model.
     */
    function hslToRgb(hue, saturation, lightness) {
      var blue, green, red;

      if (saturation) {
        var saturationShifted = lightness < 0.5 ?
            lightness * (1 + saturation) :
            lightness + saturation - lightness * saturation,
          lightnessShifted = 2 * lightness - saturationShifted;

        blue = convert(hue - 1 / 3, saturationShifted, lightnessShifted);
        green = convert(hue, saturationShifted, lightnessShifted);
        red = convert(hue + 1 / 3, saturationShifted, lightnessShifted);

        /**
         * Convert each color attribute individually.
         * @param {number} h Shifted hue.
         * @param {number} s Shifted saturation.
         * @param {number} l Shifted lightness.
         * @return {number} A color of RGB model.
         */
        function convert(h, s, l) {
          if (h < 0) h += 1;
          if (h > 1) h -= 1;
          if (h < 1/6) return l + (s - l) * 6 * h;
          if (h < 1/2) return s;
          if (h < 2/3) return l + (s - l) * (2 / 3 - h) * 6;

          return l;
        }
      } else blue = green = red = lightness;

      return [Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255)];
    }

    /**
     * Render image from provided canvas by transforming it to one of:
     * + URL object from blob (browser);
     * + buffer and data URL (server).
     * @param {Canvas & HTMLCanvasElement} canvas
     * @returns {{
     *   buffer?: Buffer;
     *   dataUrl?: string;
     * }} Buffer and data URL of the canvas.
     */
    function renderImage(canvas) {
      if (canvas.toBuffer && canvas.toDataURL) {
        var buffer = canvas.toBuffer(),
          dataUrl = canvas.toDataURL();

        return {
          buffer: buffer,
          dataUrl: dataUrl,
        };
      } else {
        canvas.toBlob(
          /**
           * @param {Blob | null} blob A file-like object of immutable, raw data.
           */
          function (blob) {
            if (blob) {
              /** blob:https://graycraft.me/32561fc1-5706-495f-8c9d-44710b03b190 */
              /** @type {HTMLImageElement} */ (document.getElementById('logo-image')).src =
                URL.createObjectURL(blob);
            }
          },
          'image/png',
        );

        return {};
      }
    }
  };
});
