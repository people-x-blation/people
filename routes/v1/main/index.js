import { Router } from 'express';

const router = new Router();
import { index } from 'index.ctrl';

router.get('/', index);

export default router;
