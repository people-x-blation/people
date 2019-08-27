import { Router } from 'express';

const router = new Router();

import { list, listAll, read, search, write } from './index.ctrl';

router.get('/', list);
router.get('/:location', list);
router.get('/read/:boardnum', read);
router.get('/search', search);
router.get('/write', write);

export default router;
