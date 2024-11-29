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

import templateSvg, { SIZE, SIZE_MIN } from '../library/graycraft.mts';
import graycraft from '../source/graycraft.umd.js';

const router = express.Router(),
  indexHandler: RequestHandler = (req, res) => {
    const { HOSTNAME, PORT, PORT_PROXY } = process.env,
      host = HOSTNAME + ':' + (req.app.get('env') === 'development' ? PORT : PORT_PROXY),
      cssBuffer = nodeFs.readFileSync('public/stylesheets/style.css'),
      scriptBuffer = nodeFs.readFileSync('public/javascripts/graycraft.umd.js'),
      css = String(cssBuffer),
      script = String(scriptBuffer),
      { back: backQuery, fore: foreQuery, round: roundQuery, size: sizeQuery } = req.query,
      back = String(backQuery ?? 'transparent'),
      fore = String(foreQuery ?? ''),
      round = roundQuery === 'true',
      size = Number(sizeQuery ?? SIZE) < SIZE_MIN ? SIZE_MIN : Number(sizeQuery ?? SIZE),
      { drawCanvas, drawSvg, hsl, renderImage } = graycraft(size, fore, back, round),
      canvas = drawCanvas(createCanvas),
      svg = templateSvg(drawSvg),
      { buffer: imageBuffer, dataUrl: image } = renderImage(canvas as Canvas & HTMLCanvasElement),
      imagePath = 'images/graycraft.png';

    nodeFs.createWriteStream('public/' + imagePath).write(imageBuffer);
    res.render('index', {
      back,
      css,
      host,
      hsl,
      image,
      imagePath,
      round,
      script,
      size,
      svg,
      title: 'Graycraft',
      year: new Date().getUTCFullYear(),
    });
  };

router.get('/', indexHandler);

export default router;
