const express = require('express');
const router = express.Router();

const Borrow = require('../models/Borrow');
const Item = require('../models/Item');
const verifyToken = require('../middleware/authMiddleware');

// =========================
// GET Semua Riwayat
// =========================
router.get('/', verifyToken, async (req, res) => {
  try {
    const history = await Borrow.findAll({
      order: [['id', 'DESC']],
    });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// AJUKAN PEMINJAMAN (USER)
// =========================
router.post('/', verifyToken, async (req, res) => {
  const { itemId, duration } = req.body;

  try {
    const parsedItemId = parseInt(itemId, 10);

    if (isNaN(parsedItemId)) {
      return res.status(400).json({
        message: 'ID Barang tidak valid',
      });
    }

    const item = await Item.findByPk(parsedItemId);

    if (!item) {
      return res.status(404).json({
        message: 'Barang tidak ditemukan',
      });
    }

    if (item.available <= 0) {
      return res.status(400).json({
        message: 'Stok barang tidak tersedia',
      });
    }

    // Ambil identitas user dari JWT
    const borrower = req.user.username || req.user.name || req.user.email || 'Mahasiswa';

    const today = new Date().toISOString().split('T')[0];

    const newBorrow = await Borrow.create({
      itemId: item.id,
      itemName: item.name,
      borrower: borrower,
      duration: duration || '1 Hari',
      date: today,
      status: 'Menunggu',
    });

    res.status(201).json(newBorrow);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// APPROVE PEMINJAMAN (ADMIN)
// =========================
router.put('/approve/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Hanya admin yang dapat menyetujui',
      });
    }

    const borrow = await Borrow.findByPk(req.params.id);

    if (!borrow) {
      return res.status(404).json({
        message: 'Data peminjaman tidak ditemukan',
      });
    }

    if (borrow.status !== 'Menunggu') {
      return res.status(400).json({
        message: 'Peminjaman sudah diproses',
      });
    }

    const item = await Item.findByPk(borrow.itemId);

    if (!item || item.available <= 0) {
      return res.status(400).json({
        message: 'Stok barang habis',
      });
    }

    // Kurangi stok setelah disetujui
    item.available -= 1;
    await item.save();

    borrow.status = 'Dipinjam';
    await borrow.save();

    res.json({
      message: 'Peminjaman berhasil disetujui',
      borrow,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// KEMBALIKAN BARANG (ADMIN)
// =========================
router.put('/return/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Hanya admin yang dapat mengembalikan',
      });
    }

    const borrow = await Borrow.findByPk(req.params.id);

    if (!borrow) {
      return res.status(404).json({
        message: 'Data tidak ditemukan',
      });
    }

    if (borrow.status !== 'Dipinjam') {
      return res.status(400).json({
        message: 'Barang belum dipinjam atau sudah dikembalikan',
      });
    }

    borrow.status = 'Dikembalikan';
    await borrow.save();

    const item = await Item.findByPk(borrow.itemId);

    if (item) {
      item.available += 1;
      await item.save();
    }

    res.json({
      message: 'Barang berhasil dikembalikan',
      borrow,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
