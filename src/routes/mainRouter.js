import { Router } from 'express';
const router = new Router();
import { index, notice } from '~/controller/mainController';

router.get('/', index);
router.get('/notice', notice);

export default router;
