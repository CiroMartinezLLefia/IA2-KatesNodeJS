import mongoose from 'mongoose';
import Vino from '../models/Vino.js';

// GET /api/vinos - List all wines
export const listVinos = async (req, res) => {
  try {
    const vins = await Vino.find();
    res.status(200).json({
      dades: vins,
      total: vins.length
    });
  } catch (error) {
    res.status(500).json({ missatge: 'Error al recuperar els vins', error: error.message });
  }
};

// GET /api/vinos/:id - Get wine by ID
export const getVinoById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ missatge: 'Vi no trobat (ID no vàlid)' });
    }
    const vi = await Vino.findById(id);
    if (!vi) {
      return res.status(404).json({ missatge: 'Vi no trobat' });
    }
    res.status(200).json(vi);
  } catch (error) {
    res.status(500).json({ missatge: 'Error al recuperar el vi', error: error.message });
  }
};

// POST /api/vinos - Create wine (requires admin)
export const createVino = async (req, res) => {
  try {
    const { nom, tipus, anyada } = req.body;
    if (!nom) {
      return res.status(400).json({ missatge: 'El nom del vi és requerit' });
    }
    const nouVino = new Vino({ nom, tipus, anyada });
    const viGuardat = await nouVino.save();
    res.status(201).json(viGuardat);
  } catch (error) {
    res.status(400).json({ missatge: 'Error al crear el vi', error: error.message });
  }
};

// PUT /api/vinos/:id - Update wine (requires admin)
export const updateVino = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ missatge: 'Vi no trobat (ID no vàlid)' });
    }
    const viActualitzat = await Vino.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!viActualitzat) {
      return res.status(404).json({ missatge: 'Vi no trobat' });
    }
    res.status(200).json(viActualitzat);
  } catch (error) {
    res.status(400).json({ missatge: 'Error al actualitzar el vi', error: error.message });
  }
};

// DELETE /api/vinos/:id - Delete wine (requires admin)
export const deleteVino = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ missatge: 'Vi no trobat (ID no vàlid)' });
    }
    const viEsborrat = await Vino.findByIdAndDelete(id);
    if (!viEsborrat) {
      return res.status(404).json({ missatge: 'Vi no trobat' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ missatge: 'Error al esborrar el vi', error: error.message });
  }
};
