import { Router } from 'express';

const router = new Router();
const controller = require('./index.ctrl');

router.get('/', controller.index);

export default router;
