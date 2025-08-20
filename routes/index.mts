/**
 * Index page route handler.
 *
 * @module routes/index
 */

import type { RequestHandler } from 'express';

import { Canvas, createCanvas } from 'canvas';
import express from 'express';

import nodeFs from 'node:fs';

import templateSvg, { SIZE, SIZE_MIN } from '../library/graycraft.mts';
import graycraft from '../source/graycraft.mjs';

const router = express.Router(),
  indexHandler: RequestHandler = (req, res) => {
    const { DEPLOYMENT, HOSTNAME, PORT, PORT_PROXY } = process.env,
      externalLinkBuffer = nodeFs.readFileSync('static/images/external_link.svg'),
      externalLink = String(externalLinkBuffer),
      host = HOSTNAME + ':' + (DEPLOYMENT === 'local' ? PORT : PORT_PROXY),
      cssBuffer = nodeFs.readFileSync('distribution/main.css'),
      scriptBuffer = nodeFs.readFileSync('distribution/graycraft.umd.js'),
      css = String(cssBuffer),
      script = String(scriptBuffer),
      { back: backQuery, fore: foreQuery, round: roundQuery, size: sizeQuery } = req.query,
      back = String(backQuery ?? 'transparent'),
      fore = String(foreQuery ?? ''),
      round = roundQuery === 'true',
      size = Number(sizeQuery ?? SIZE) < SIZE_MIN ? SIZE_MIN : Number(sizeQuery ?? SIZE),
      { drawCanvas, drawSvg, getYear, hsl, hslLight, renderImage, rgb } = graycraft(
        size,
        fore,
        back,
        round,
      ),
      canvas = drawCanvas(createCanvas),
      svg = templateSvg(drawSvg),
      { buffer: imageBuffer, dataUrl: image } = renderImage(canvas as Canvas & HTMLCanvasElement),
      /**
       * Replace `fill` attributes value of a SVG with a specified color.
       * @param {string} svg SVG source code.
       * @param {string} color New color value.
       * @returns {string} SVG source code with replaced fill color.
       */
      fillSvg = (svg: string, color: string) => {
        const filled = global.encodeURIComponent(
          svg.replaceAll('fill="silver"', `fill="${color}"`),
        );

        return filled;
      },
      externalLink40 = fillSvg(externalLink, '#404040'),
      externalLink48 = fillSvg(externalLink, '#484848'),
      externalLinkBlack = fillSvg(externalLink, 'black'),
      externalLinkCotd = fillSvg(externalLink, rgb),
      imagePath = 'images/graycraft-cotd.png';

    nodeFs.createWriteStream('static/' + imagePath).write(imageBuffer);
    res.render('index', {
      back,
      css,
      externalLink40,
      externalLink48,
      externalLinkBlack,
      externalLinkCotd,
      host,
      hsl,
      hslLight,
      /** Image from a base64 data URL (fast). */
      image,
      /** Image loading from a file URL (slow). */
      imagePath,
      rgb,
      round,
      script,
      size,
      /** SVG from the compiled Pug template (fastest). */
      svg,
      title: 'GrayCraft',
      year: getYear(),
    });
  };

router.get('/', indexHandler);

export default router;
