import express from 'express';
import { registro, login, perfil } from '../controllers/authController.js';
import { protegir } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/registro', registro);
router.post('/login', login);
router.put('/perfil', protegir, perfil);

export default router;
