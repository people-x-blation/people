import { Router } from 'express';
import isValidate from '~/lib/validate';
const router = new Router();

import * as boardCtrl from './index.ctrl';

router.get(
  '/write',
  (req, res, next) => isValidate(req, res, next),
  boardCtrl.write,
);
router.get('/read/:boardnum', boardCtrl.read);
router.get('/search', boardCtrl.search);
router.get('/', boardCtrl.boardlist);
router.get('/:location', boardCtrl.boardlist);
// router.get('/upload', boardCtrl.upload);

export default router;

