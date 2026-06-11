import mongoose from 'mongoose';
import request from 'supertest';
import dotenv from 'dotenv';
import app from '../src/app.js';
import Usuario from '../src/models/Usuario.js';
import Cervesa from '../src/models/Cervesa.js';
import Vino from '../src/models/Vino.js';

// Load env variables
dotenv.config({ path: '.env.test' });

describe('REST API Test Suite (Auth, Cervezas, Vinos)', () => {
  let userToken;
  let adminToken;
  let createdBeerId;
  let createdWineId;

  const testUser = {
    email: 'user_jest@test.com',
    password: 'userpassword123'
  };

  const testAdmin = {
    email: 'admin_jest@test.com',
    password: 'adminpassword123',
    rol: 'admin'
  };

  // Connect to the test database and clear it before running tests
  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/api_cervezas_test';
    await mongoose.connect(mongoUri);
    // Clear databases
    await Usuario.deleteMany({});
    await Cervesa.deleteMany({});
    await Vino.deleteMany({});
  });

  // Disconnect from database and clean up
  afterAll(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.connection.close();
  });

  // =================================================================
  // 1. AUTHENTICATION TESTS
  // =================================================================
  describe('Auth Operations (/api/auth)', () => {
    it('should register a new normal user', async () => {
      const res = await request(app)
        .post('/api/auth/registro')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('usuari');
      expect(res.body.usuari.email).toBe(testUser.email);
      expect(res.body.usuari.rol).toBe('usuari');
      expect(res.body.usuari).not.toHaveProperty('password');
    });

    it('should prevent registering a duplicate user email', async () => {
      const res = await request(app)
        .post('/api/auth/registro')
        .send(testUser);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('missatge');
    });

    it('should login the registered normal user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send(testUser);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      userToken = res.body.token;
    });

    it('should fail login with wrong credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('missatge');
    });

    it('should register an admin user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/registro')
        .send(testAdmin);

      expect(res.status).toBe(201);
      expect(res.body.usuari.rol).toBe('admin');
    });

    it('should login the admin user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testAdmin.email,
          password: testAdmin.password
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      adminToken = res.body.token;
    });

    it('should update normal user profile email and password with token', async () => {
      const res = await request(app)
        .put('/api/auth/perfil')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          email: 'user_jest_updated@test.com',
          password: 'newsecurepassword123'
        });

      expect(res.status).toBe(200);
      expect(res.body.usuari.email).toBe('user_jest_updated@test.com');

      // Update local credentials and login again to retrieve the new token
      testUser.email = 'user_jest_updated@test.com';
      testUser.password = 'newsecurepassword123';
      
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send(testUser);
      expect(loginRes.status).toBe(200);
      userToken = loginRes.body.token;
    });

    it('should deny updating profile without token', async () => {
      const res = await request(app)
        .put('/api/auth/perfil')
        .send({ email: 'newhacker@test.com' });

      expect(res.status).toBe(401);
    });
  });

  // =================================================================
  // 2. CERVEZAS TESTS
  // =================================================================
  describe('Cervezas Operations (/api/cervezas)', () => {
    it('should block reading beers without token', async () => {
      const res = await request(app).get('/api/cervezas');
      expect(res.status).toBe(401);
    });

    it('should list beers when authenticated', async () => {
      const res = await request(app)
        .get('/api/cervezas')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('dades');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.dades)).toBe(true);
    });

    it('should deny creating a beer for non-admin user', async () => {
      const res = await request(app)
        .post('/api/cervezas')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          nom: 'Voll Damm',
          graduacio: 7.2,
          tipus: 'Double Marzen'
        });

      expect(res.status).toBe(403);
    });

    it('should allow creating a beer for admin user', async () => {
      const res = await request(app)
        .post('/api/cervezas')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nom: 'Voll Damm',
          graduacio: 7.2,
          tipus: 'Double Marzen'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.nom).toBe('Voll Damm');
      createdBeerId = res.body._id;
    });

    it('should get a beer by valid ID', async () => {
      const res = await request(app)
        .get(`/api/cervezas/${createdBeerId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.nom).toBe('Voll Damm');
    });

    it('should return 404 for nonexistent beer ID', async () => {
      const res = await request(app)
        .get('/api/cervezas/60afb1234567890123456789')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
    });

    it('should deny updating a beer for non-admin user', async () => {
      const res = await request(app)
        .put(`/api/cervezas/${createdBeerId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ graduacio: 7.3 });

      expect(res.status).toBe(403);
    });

    it('should allow updating a beer for admin user', async () => {
      const res = await request(app)
        .put(`/api/cervezas/${createdBeerId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ graduacio: 7.3, tipus: 'Doble Malta' });

      expect(res.status).toBe(200);
      expect(res.body.graduacio).toBe(7.3);
      expect(res.body.tipus).toBe('Doble Malta');
    });

    it('should deny uploading beer image for non-admin user', async () => {
      const res = await request(app)
        .patch(`/api/cervezas/${createdBeerId}/imatge`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      expect(res.status).toBe(403);
    });

    it('should reject uploading beer image without file', async () => {
      const res = await request(app)
        .patch(`/api/cervezas/${createdBeerId}/imatge`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it('should deny deleting a beer for non-admin user', async () => {
      const res = await request(app)
        .delete(`/api/cervezas/${createdBeerId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it('should allow deleting a beer for admin user', async () => {
      const res = await request(app)
        .delete(`/api/cervezas/${createdBeerId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(204);
    });
  });

  // =================================================================
  // 3. VINOS TESTS (EJ6)
  // =================================================================
  describe('Vinos Operations (/api/vinos)', () => {
    it('should block reading wines without token', async () => {
      const res = await request(app).get('/api/vinos');
      expect(res.status).toBe(401);
    });

    it('should list wines when authenticated', async () => {
      const res = await request(app)
        .get('/api/vinos')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('dades');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.dades)).toBe(true);
    });

    it('should deny creating a wine for non-admin user', async () => {
      const res = await request(app)
        .post('/api/vinos')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          nom: 'Marqués de Riscal',
          tipus: 'Negre Reserva',
          anyada: 2018
        });

      expect(res.status).toBe(403);
    });

    it('should allow creating a wine for admin user', async () => {
      const res = await request(app)
        .post('/api/vinos')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nom: 'Marqués de Riscal',
          tipus: 'Negre Reserva',
          anyada: 2018
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.nom).toBe('Marqués de Riscal');
      createdWineId = res.body._id;
    });

    it('should get a wine by valid ID', async () => {
      const res = await request(app)
        .get(`/api/vinos/${createdWineId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.nom).toBe('Marqués de Riscal');
    });

    it('should return 404 for nonexistent wine ID', async () => {
      const res = await request(app)
        .get('/api/vinos/60afb1234567890123456789')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(404);
    });

    it('should deny updating a wine for non-admin user', async () => {
      const res = await request(app)
        .put(`/api/vinos/${createdWineId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ anyada: 2019 });

      expect(res.status).toBe(403);
    });

    it('should allow updating a wine for admin user', async () => {
      const res = await request(app)
        .put(`/api/vinos/${createdWineId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ anyada: 2019, tipus: 'Gran Reserva' });

      expect(res.status).toBe(200);
      expect(res.body.anyada).toBe(2019);
      expect(res.body.tipus).toBe('Gran Reserva');
    });

    it('should deny deleting a wine for non-admin user', async () => {
      const res = await request(app)
        .delete(`/api/vinos/${createdWineId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it('should allow deleting a wine for admin user', async () => {
      const res = await request(app)
        .delete(`/api/vinos/${createdWineId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(204);
    });
  });
});
