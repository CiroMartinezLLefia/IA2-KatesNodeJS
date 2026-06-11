import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cervezasRouter from './routes/cervezasRoutes.js';
import authRouter from './routes/authRoutes.js';
import vinosRouter from './routes/vinosRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware to parse JSON
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/cervezas', cervezasRouter);
app.use('/api/vinos', vinosRouter);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(path.dirname(__dirname), 'uploads')));

// GET /api - welcome message and endpoints list
app.get('/api', (req, res) => {
  res.status(200).json({
    missatge: 'Benvingut a l\'API REST de cerveses i vins',
    versio: '1.0.0',
    endpoints: [
      { metode: 'GET', ruta: '/api', descripcio: 'Llista d\'endpoints disponibles i informació' },
      { metode: 'GET', ruta: '/health', descripcio: 'Estat del servidor' },
      { metode: 'POST', ruta: '/api/auth/registro', descripcio: 'Registrar un usuari' },
      { metode: 'POST', ruta: '/api/auth/login', descripcio: 'Iniciar sessió (obté token)' },
      { metode: 'PUT', ruta: '/api/auth/perfil', descripcio: 'Actualitzar dades de perfil (requereix autenticació)' },
      { metode: 'GET', ruta: '/api/cervezas', descripcio: 'Llistar cerveses (requereix autenticació)' },
      { metode: 'GET', ruta: '/api/cervezas/:id', descripcio: 'Obtenir cervesa per ID (requereix autenticació)' },
      { metode: 'POST', ruta: '/api/cervezas', descripcio: 'Crear cervesa (requereix admin)' },
      { metode: 'PUT', ruta: '/api/cervezas/:id', descripcio: 'Actualitzar cervesa (requereix admin)' },
      { metode: 'DELETE', ruta: '/api/cervezas/:id', descripcio: 'Esborrar cervesa (requereix admin)' },
      { metode: 'PATCH', ruta: '/api/cervezas/:id/imatge', descripcio: 'Pujar imatge per a cervesa (requereix admin)' },
      { metode: 'GET', ruta: '/api/vinos', descripcio: 'Llistar vins (requereix autenticació)' },
      { metode: 'GET', ruta: '/api/vinos/:id', descripcio: 'Obtenir vi per ID (requereix autenticació)' },
      { metode: 'POST', ruta: '/api/vinos', descripcio: 'Crear vi (requereix admin)' },
      { metode: 'PUT', ruta: '/api/vinos/:id', descripcio: 'Actualitzar vi (requereix admin)' },
      { metode: 'DELETE', ruta: '/api/vinos/:id', descripcio: 'Esborrar vi (requereix admin)' }
    ]
  });
});

// GET /health - health check
app.get('/health', (req, res) => {
  res.status(200).json({ estat: 'ok' });
});

// GET / - Redirect to /api
app.get('/', (req, res) => {
  res.redirect('/api');
});

export default app;
