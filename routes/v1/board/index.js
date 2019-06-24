import { Router } from 'express';

const router = new Router();
const controller = require('./index.ctrl');

router.get('/', controller.list);
router.get('/list', controller.list);

export default router;
