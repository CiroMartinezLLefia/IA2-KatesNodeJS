import mongoose from 'mongoose';
import Cervesa from '../models/Cervesa.js';

// GET /api/cervezas - List all beers
export const listCervezas = async (req, res) => {
  try {
    const cerveses = await Cervesa.find();
    res.status(200).json({
      dades: cerveses,
      total: cerveses.length
    });
  } catch (error) {
    res.status(500).json({ missatge: 'Error al recuperar les cerveses', error: error.message });
  }
};

// GET /api/cervezas/:id - Get beer by ID
export const getCervezaById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ missatge: 'Cervesa no trobada (ID no vàlid)' });
    }
    const cervesa = await Cervesa.findById(id);
    if (!cervesa) {
      return res.status(404).json({ missatge: 'Cervesa no trobada' });
    }
    res.status(200).json(cervesa);
  } catch (error) {
    res.status(500).json({ missatge: 'Error al recuperar la cervesa', error: error.message });
  }
};

// POST /api/cervezas - Create beer (requires admin later)
export const createCerveza = async (req, res) => {
  try {
    const { nom, graduacio, tipus } = req.body;
    if (!nom) {
      return res.status(400).json({ missatge: 'El nom de la cervesa és requerit' });
    }
    const novaCervesa = new Cervesa({ nom, graduacio, tipus });
    const cervesaGuardada = await novaCervesa.save();
    res.status(201).json(cervesaGuardada);
  } catch (error) {
    res.status(400).json({ missatge: 'Error al crear la cervesa', error: error.message });
  }
};

// PUT /api/cervezas/:id - Update beer (requires admin later)
export const updateCerveza = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ missatge: 'Cervesa no trobada (ID no vàlid)' });
    }
    const cervesaActualitzada = await Cervesa.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!cervesaActualitzada) {
      return res.status(404).json({ missatge: 'Cervesa no trobada' });
    }
    res.status(200).json(cervesaActualitzada);
  } catch (error) {
    res.status(400).json({ missatge: 'Error al actualitzar la cervesa', error: error.message });
  }
};

// DELETE /api/cervezas/:id - Delete beer (requires admin later)
export const deleteCerveza = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ missatge: 'Cervesa no trobada (ID no vàlid)' });
    }
    const cervesaEsborrada = await Cervesa.findByIdAndDelete(id);
    if (!cervesaEsborrada) {
      return res.status(404).json({ missatge: 'Cervesa no trobada' });
    }
    res.status(204).send(); // No content response on successful deletion
  } catch (error) {
    res.status(500).json({ missatge: 'Error al esborrar la cervesa', error: error.message });
  }
};

// PATCH /api/cervezas/:id/imatge - Upload image for beer (requires admin later)
export const uploadImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ missatge: 'Cervesa no trobada (ID no vàlid)' });
    }
    if (!req.file) {
      return res.status(400).json({ missatge: 'S\'ha de proporcionar un fitxer d\'imatge' });
    }
    const imatgePath = `uploads/${req.file.filename}`;
    const cervesaActualitzada = await Cervesa.findByIdAndUpdate(
      id,
      { imatge: imatgePath },
      { new: true }
    );
    if (!cervesaActualitzada) {
      return res.status(404).json({ missatge: 'Cervesa no trobada' });
    }
    res.status(200).json(cervesaActualitzada);
  } catch (error) {
    res.status(500).json({ missatge: 'Error al pujar la imatge', error: error.message });
  }
};
