import { Router } from 'express';
import passport from 'passport';
import * as authCtrl from './index.ctrl';
import isValidate from '~/lib/validate';

const router = new Router();

router.get('/kakao/success', authCtrl.successLogin);

router.get(
  '/kakao',
  (req, res, next) => isValidate(req, res, next),
  passport.authenticate('kakao'),
  authCtrl.login,
);

router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/',
  }),
  authCtrl.login,
);

router.get('/logout', authCtrl.logout);
router.get('/mypage', authCtrl.mypage);
router.post('/register',authCtrl.register);
router.get('/leave', authCtrl.leave);
export default router;
