import {Router} from 'express';
import {create, getAll, remove} from '../controllers/stickers.js';

const router = Router();

router.get('/api/stickers', getAll);

router.post('/api/stickers', create);

router.get('/api/stickers/remove', remove);

export default router;