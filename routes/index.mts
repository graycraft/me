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
      externalLinkBuffer = nodeFs.readFileSync('public/images/external_link.svg'),
      externalLink = global.encodeURIComponent(String(externalLinkBuffer)),
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
      { drawCanvas, drawSvg, hsl, hslLight, renderImage, rgb } = graycraft(size, fore, back, round),
      canvas = drawCanvas(createCanvas),
      svg = templateSvg(drawSvg),
      { buffer: imageBuffer, dataUrl: image } = renderImage(canvas as Canvas & HTMLCanvasElement),
      imagePath = 'images/graycraft-cotd.png';

    nodeFs.createWriteStream('public/' + imagePath).write(imageBuffer);
    res.render('index', {
      back,
      css,
      externalLink,
      host,
      hsl,
      hslLight,
      image,
      imagePath,
      rgb,
      round,
      script,
      size,
      svg,
      title: 'GrayCraft',
      year: new Date().getUTCFullYear(),
    });
  };

router.get('/', indexHandler);

export default router;
