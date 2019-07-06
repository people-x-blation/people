import { Router } from 'express';

const router = new Router();

import { 
    list,
    read
     } from './index.ctrl';

router.get('/', list);
router.get('/read', read);

export default router;
