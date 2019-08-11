import { Router } from 'express';
import passport from 'passport';
import { kakao } from './index.ctrl';

const router = new Router();

router.get('/kakao', passport.authenticate('kakao'), kakao);

export default router;
