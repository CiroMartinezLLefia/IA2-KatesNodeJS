import express from 'express';
import {
  listCervezas,
  getCervezaById,
  createCerveza,
  updateCerveza,
  deleteCerveza,
  uploadImage
} from '../controllers/cervezasController.js';
import { protegir, autoritzar } from '../middlewares/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

// Multer error handling wrapper
const uploadWrapper = (req, res, next) => {
  upload.single('imatge')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ missatge: 'Error al pujar l\'arxiu', error: err.message });
    }
    next();
  });
};

// All cerveza routes require authentication (EJ3)
router.use(protegir);

router.get('/', listCervezas);
router.get('/:id', getCervezaById);

// Write actions require admin role (EJ4)
router.post('/', autoritzar('admin'), createCerveza);
router.put('/:id', autoritzar('admin'), updateCerveza);
router.delete('/:id', autoritzar('admin'), deleteCerveza);

// Upload route (EJ4B)
router.patch('/:id/imatge', autoritzar('admin'), uploadWrapper, uploadImage);

export default router;
