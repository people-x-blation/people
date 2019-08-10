import { Router } from 'express';

const router = new Router();
import { kakao } from './index.ctrl';

router.get('/kakao', kakao);

export default router;
