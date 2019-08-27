import { Router } from 'express';
import passport from 'passport';
const router = new Router();

import { boardlist, read, search, write } from './index.ctrl';

router.get('/write', passport.authenticate('kakao'), write);
router.get('/', boardlist);
router.get('/:location', boardlist);
router.get('/read', read);
router.get('/search', search);

export default router;
