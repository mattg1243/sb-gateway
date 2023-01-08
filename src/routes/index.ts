import { Router } from 'express';
import { indexHandler } from '../handlers';
import { loginHandler, logoutHandler } from '../handlers/index';

const router = Router();

router.post('/login', loginHandler);
router.get('/logout', logoutHandler);
router.get('/', indexHandler);

export default router;
