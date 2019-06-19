import { Router } from 'express';
import userRouter from './v1/user';
import authRouter from './v1/auth';

const router = new Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);

export default router;
