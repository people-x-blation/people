import { Router } from 'express';

const router = new Router();
import { mypage, terms } from './index.ctrl';

router.get('/mypage', mypage);
router.post('/request_off', request_off);

export default router;
