import mongoose from 'mongoose';

const vinoSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'El nom del vi és obligatori'],
    trim: true
  },
  tipus: {
    type: String,
    required: false,
    trim: true
  },
  anyada: {
    type: Number,
    required: false
  }
}, {
  timestamps: true
});

const Vino = mongoose.model('Vino', vinoSchema);

export default Vino;
