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
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/borrows', borrowRoutes);
app.use('/api/auth', authRoutes);

// Start Server
async function startServer() {
  try {
    // Koneksi database
    await db.authenticate();
    console.log('Database berhasil terhubung.');

    // Sinkronisasi tabel
    await db.sync({ alter: true });

    // =========================
    // Seed Barang (sekali saja)
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
    // Seed User (sekali saja)
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

    // Jalankan server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Gagal menjalankan server:', error);
    process.exit(1);
  }
}

startServer();
