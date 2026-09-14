require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./Config/database');
const Item = require('./models/Item');
const User = require('./models/User');

const itemRoutes = require('./routes/itemRoutes');
const borrowRoutes = require('./routes/borrowRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/borrows', borrowRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend Peminjaman berjalan',
  });
});

// Inisialisasi database
let databaseInitialized = false;

async function initializeDatabase() {
  if (databaseInitialized) return;

  try {
    await db.authenticate();
    console.log('Database berhasil terhubung.');

    await db.sync({ alter: true });

    // =========================
    // Seed Barang
    // =========================
    const totalItem = await Item.count();

    if (totalItem === 0) {
      await Item.bulkCreate([
        {
          name: 'Proyektor Epson EB-X400',
          category: 'Elektronik',
          total: 3,
          available: 3,
        },
        {
          name: 'Kamera Canon EOS 80D',
          category: 'Fotografi',
          total: 2,
          available: 1,
        },
      ]);

      console.log('Data barang awal berhasil ditambahkan.');
    }

    // =========================
    // Seed User
    // =========================
    const totalUser = await User.count();

    if (totalUser === 0) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      const userPassword = await bcrypt.hash('user123', 10);

      await User.bulkCreate([
        {
          name: 'Admin PinjamApp',
          email: 'admin@gmail.com',
          password: adminPassword,
          role: 'admin',
        },
        {
          name: 'Fahrul User',
          email: 'user@gmail.com',
          password: userPassword,
          role: 'user',
        },
      ]);

      console.log('Akun awal berhasil dibuat.');
    }

    databaseInitialized = true;
  } catch (error) {
    console.error('DATABASE ERROR:', error);
    throw error;
  }
}

// Export untuk Vercel
module.exports = async (req, res) => {
  try {
    await initializeDatabase();
    return app(req, res);
  } catch (error) {
    console.error('SERVER ERROR:', error);

    return res.status(500).json({
      message: 'Server gagal terhubung ke database',
      error: error.message,
    });
  }
};
