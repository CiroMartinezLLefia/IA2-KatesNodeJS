import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from '../models/Usuario.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = 'admin@api.com';
    const adminExists = await Usuario.findOne({ email: adminEmail });

    if (adminExists) {
      console.log(`L'usuari admin (${adminEmail}) ja existeix.`);
    } else {
      const admin = new Usuario({
        email: adminEmail,
        password: 'adminpassword123',
        rol: 'admin'
      });
      await admin.save();
      console.log(`Usuari admin creat correctament!`);
      console.log(`Email: ${adminEmail}`);
      console.log(`Contrasenya: adminpassword123`);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
