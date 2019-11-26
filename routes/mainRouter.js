import { Router } from 'express';
const router = new Router();
import { index, notice } from './index.ctrl';

router.get('/', index);
router.get('/notice', notice);

export default router;
