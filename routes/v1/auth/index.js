import { Router } from 'express';
import passport from 'passport';
import * as authCtrl from './index.ctrl';
import isValidate from '~/lib/validate';

const router = new Router();
router.get('/kakao/success', authCtrl.successLogin);

<<<<<<< HEAD
router.get('/login', function(req,res){
    res.render('auth/login');
});

=======
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
>>>>>>> 9cf5ec9ec2398909fb02b7beada65ee35588c50f
export default router;
