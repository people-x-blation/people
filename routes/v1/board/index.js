import { Router } from 'express';

const router = new Router();

import { 
    list,
    read,
    search,
    write
    } from './index.ctrl';

router.get('/', list);
router.get('/read', read);
router.get('/search', search);
router.get('/write', write);

export default router;
