import { Router } from 'express';

const router = new Router();
import { mypage, terms } from './index.ctrl';

router.get('/mypage', mypage);
router.get('/terms', terms);

export default router;
