/**
 * Index page route handler.
 *
 * @module routes/index
 */

import type { RequestHandler } from 'express';

import { Canvas, createCanvas } from 'canvas';
import 'dotenv/config';
import express from 'express';

import nodeFs from 'node:fs';

import fillSvg, { SIZE } from '../library/graycraft.mts';
import graycraft from '../source/graycraft.umd.js';

const router = express.Router(),
  indexHandler: RequestHandler = (req, res) => {
    const { HOSTNAME, PORT_PROXY } = process.env,
      host = HOSTNAME + ':' + PORT_PROXY,
      cssBuffer = nodeFs.readFileSync('public/stylesheets/style.css'),
      scriptBuffer = nodeFs.readFileSync('public/javascripts/graycraft.umd.js'),
      css = String(cssBuffer),
      script = String(scriptBuffer),
      { color: colorQuery, size: sizeQuery } = req.query,
      color = String(colorQuery ?? ''),
      size = Number(sizeQuery ?? SIZE),
      { drawCanvas, drawImage, drawSvg, hsl } = graycraft(size, color),
      canvas = drawCanvas(createCanvas),
      svg = fillSvg(drawSvg),
      { buffer: imageBuffer, dataUrl: image } = drawImage(canvas as Canvas & HTMLCanvasElement),
      imagePath = 'images/graycraft.png';

    nodeFs.createWriteStream('public/' + imagePath).write(imageBuffer);
    res.render('index', {
      color,
      css,
      host,
      hsl,
      // image,
      imagePath,
      script,
      size,
      svg,
      title: 'Graycraft',
      year: new Date().getUTCFullYear(),
    });
  };

router.get('/', indexHandler);

export default router;
