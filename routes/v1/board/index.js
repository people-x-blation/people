import { Router } from 'express';
import isValidate from '~/lib/validate';
const router = new Router();

import { boardlist, read, search, write } from './index.ctrl';

router.get('/write', (req, res, next) => isValidate(req, res, next), write);
router.get('/read/:boardnum', read);
router.get('/search', search);
router.get('/', boardlist);
router.get('/:location', boardlist);

export default router;
