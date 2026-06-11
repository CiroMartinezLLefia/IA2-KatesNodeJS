import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

export const protegir = async (req, res, next) => {
  let token;

  // Check if Bearer token is provided in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ missatge: 'No autoritzat, falta el token' });
  }

  try {
    // Verify token
    const descodificat = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_987654321');

    // Find user by ID and attach it to request
    const usuari = await Usuario.findById(descodificat.id).select('-password');
    if (!usuari) {
      return res.status(401).json({ missatge: 'No autoritzat, usuari no trobat' });
    }

    req.usuari = usuari;
    next();
  } catch (error) {
    return res.status(401).json({ missatge: 'No autoritzat, token invàlid o expirat' });
  }
};

export const autoritzar = (...rols) => {
  return (req, res, next) => {
    // Make sure user is attached from protegir middleware
    if (!req.usuari) {
      return res.status(401).json({ missatge: 'No autoritzat' });
    }

    // Check if user's role is in the allowed roles list
    if (!rols.includes(req.usuari.rol)) {
      return res.status(403).json({ missatge: `Accés denegat: es requereix un rol de: ${rols.join(', ')}` });
    }

    next();
  };
};
