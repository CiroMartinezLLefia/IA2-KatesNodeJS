import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'L\'email és obligatori'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Si us plau, introduïu un email vàlid']
  },
  password: {
    type: String,
    required: [true, 'La contrasenya és obligatòria'],
    minlength: [6, 'La contrasenya ha de tenir com a mínim 6 caràcters']
  },
  rol: {
    type: String,
    enum: ['usuari', 'admin'],
    default: 'usuari'
  }
}, {
  timestamps: true
});

// Pre-save hook to hash password
usuarioSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
usuarioSchema.methods.comprovarPassword = async function(candidatPassword) {
  return await bcrypt.compare(candidatPassword, this.password);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;
