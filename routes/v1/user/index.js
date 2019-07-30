import { Router } from 'express';

const router = new Router();
import {
    find_id,
    find_pw,
    login,
    mypage,
    signup,
    terms
} from './index.ctrl';

router.get('/login', login);
router.get('/mypage', mypage);
router.get('/signup', signup);
router.get('/terms', terms);
router.get('/find_id', find_id);
router.get('/find_pw', find_pw);

export default router;
