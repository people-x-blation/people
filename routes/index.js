import { Router } from 'express';
import userRouter from './userRouter';
import authRouter from './authRouter';
import mainRouter from './mainRouter';
import boardRouter from './boardRouter';

const router = new Router();

router.use('/', mainRouter);
router.use('/board', boardRouter);
router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/error', (req, res) => {
  res.render('error');
});

export default router;
