import { Router } from 'express';
import userRouter from './v1/user';
import authRouter from './v1/auth';
import mainRouter from './v1/main';
import boardRouter from './v1/board';

const router = new Router();

router.use('/', mainRouter);
router.use('/board', boardRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);

export default router;
