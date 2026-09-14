require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./Config/database');

const itemRoutes = require('./routes/itemRoutes');
const borrowRoutes = require('./routes/borrowRoutes');
const authRoutes = require('./routes/authRoutes');

const Item = require('./models/Item');
const User = require('./models/User');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/items', itemRoutes);
app.use('/api/borrows', borrowRoutes);
app.use('/api/auth', authRoutes);

let initialized = false;

async function initializeDatabase() {
  if (initialized) return;

  await db.authenticate();
  console.log('Database berhasil terhubung.');

  await db.sync({ alter: true });

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

  initialized = true;
}

app.use(async (req, res, next) => {
  try {
    await initializeDatabase();
    next();
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

module.exports = app;
