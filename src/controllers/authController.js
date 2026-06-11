import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

// Helper to generate JWT token
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_987654321', {
    expiresIn: '30d'
  });
};

// POST /api/auth/registro
export const registro = async (req, res) => {
  try {
    const { email, password, rol } = req.body;

    if (!email || !password) {
      return res.status(400).json({ missatge: 'L\'email i la contrasenya són obligatoris' });
    }

    // Check if user already exists
    const usuariExisteix = await Usuario.findOne({ email });
    if (usuariExisteix) {
      return res.status(400).json({ missatge: 'L\'email ja està registrat' });
    }

    // Create user. If a role is passed, we use it (useful for seeding/testing admin)
    const nouUsuari = new Usuario({
      email,
      password,
      rol: rol || 'usuari'
    });

    const usuariGuardat = await nouUsuari.save();

    // Generate token
    const token = generarToken(usuariGuardat._id);

    // Prepare response user object (without password)
    const usuariResponse = usuariGuardat.toObject();
    delete usuariResponse.password;

    res.status(201).json({
      token,
      usuari: usuariResponse
    });
  } catch (error) {
    res.status(400).json({ missatge: 'Error en el registre de l\'usuari', error: error.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ missatge: 'L\'email i la contrasenya són obligatoris' });
    }

    // Find user by email
    const usuari = await Usuario.findOne({ email });
    if (!usuari) {
      return res.status(401).json({ missatge: 'Credencials incorrectes (email no trobat)' });
    }

    // Compare password
    const contrasenyaCorrecta = await usuari.comprovarPassword(password);
    if (!contrasenyaCorrecta) {
      return res.status(401).json({ missatge: 'Credencials incorrectes (contrasenya incorrecta)' });
    }

    // Generate token
    const token = generarToken(usuari._id);

    // Prepare response
    const usuariResponse = usuari.toObject();
    delete usuariResponse.password;

    res.status(200).json({
      token,
      usuari: usuariResponse
    });
  } catch (error) {
    res.status(500).json({ missatge: 'Error en l\'inici de sessió', error: error.message });
  }
};

// PUT /api/auth/perfil - Protected
export const perfil = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user from DB with password field, using the ID from the protection middleware
    const usuari = await Usuario.findById(req.usuari._id);
    if (!usuari) {
      return res.status(404).json({ missatge: 'Usuari no trobat' });
    }

    // Check if new email already exists (excluding current user)
    if (email && email !== usuari.email) {
      const emailExisteix = await Usuario.findOne({ email });
      if (emailExisteix) {
        return res.status(400).json({ missatge: 'Aquest email ja està en ús per un altre usuari' });
      }
      usuari.email = email;
    }

    // If new password is provided, set it (will be hashed by the pre('save') hook)
    if (password) {
      usuari.password = password;
    }

    const usuariActualitzat = await usuari.save();

    // Prepare response user object
    const usuariResponse = usuariActualitzat.toObject();
    delete usuariResponse.password;

    res.status(200).json({
      missatge: 'Perfil actualitzat correctament',
      usuari: usuariResponse
    });
  } catch (error) {
    res.status(400).json({ missatge: 'Error al actualitzar el perfil', error: error.message });
  }
};
