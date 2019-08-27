import { Router } from 'express';
import passport from 'passport';

const router = new Router();

router.get('/login', function(req,res){
    res.render('auth/login');
});

export default router;
