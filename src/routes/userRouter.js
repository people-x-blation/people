import { Router } from 'express';

const router = new Router();
import { mypage, request_off, blood_change } from '~/controller/userController';

router.get('/mypage', mypage);
router.post('/request_off', request_off);
router.post('/blood_change', blood_change);
export default router;
