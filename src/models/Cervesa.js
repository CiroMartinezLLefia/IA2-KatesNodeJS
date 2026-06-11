import mongoose from 'mongoose';

const cervesaSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'El nom de la cervesa és obligatori'],
    trim: true
  },
  graduacio: {
    type: Number,
    required: false,
    default: 0
  },
  tipus: {
    type: String,
    required: false,
    trim: true
  },
  imatge: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

const Cervesa = mongoose.model('Cervesa', cervesaSchema);

export default Cervesa;
