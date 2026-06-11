import express from 'express';
import {
  listVinos,
  getVinoById,
  createVino,
  updateVino,
  deleteVino
} from '../controllers/vinosController.js';
import { protegir, autoritzar } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All wine routes require authentication
router.use(protegir);

router.get('/', listVinos);
router.get('/:id', getVinoById);

// Write actions require admin role
router.post('/', autoritzar('admin'), createVino);
router.put('/:id', autoritzar('admin'), updateVino);
router.delete('/:id', autoritzar('admin'), deleteVino);

export default router;
