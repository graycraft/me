/**
 * Index page route handler.
 *
 * @module routes/index
 */

import type { RequestHandler } from 'express';

import 'dotenv/config';
import express from 'express';

const router = express.Router(),
  indexHandler: RequestHandler = (req, res) => {
    res.render('index', { title: 'Express' });
  };

router.get('/', indexHandler);

export default router;
