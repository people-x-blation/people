import { Router } from 'express';
import passport from 'passport';
const router = new Router();

import { boardlist, read, search, write } from './index.ctrl';


router.get('/search', search);
router.get('/write', passport.authenticate('kakao'), write);
router.get('/:location', boardlist);
router.get('/', boardlist);
router.get('/read/:boardnum', read);

export default router;
