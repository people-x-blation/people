import { Router } from 'express';

const router = new Router();

router.get('/',function(req,res,next){
   res.render('board/list',{}); 
});
router.get('/list',function(req,res,next){
   res.render('board/list',{}); 
});

export default router;
