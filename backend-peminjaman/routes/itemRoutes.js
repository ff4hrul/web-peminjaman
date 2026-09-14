const express = require('express');
const router = express.Router();

const Item = require('../models/Item');
const verifyToken = require('../middleware/authMiddleware');

// =========================
// GET semua barang (Public)
// =========================
router.get('/', async (req, res) => {
  try {
    const items = await Item.findAll({
      order: [['id', 'ASC']],
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// =========================
// POST tambah barang (Admin)
// =========================
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Hanya admin yang dapat menambah barang.',
      });
    }

    const { name, category, total, available } = req.body;

    const newItem = await Item.create({
      name,
      category,
      total,
      available,
    });

    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// =========================
// PUT edit barang (Admin)
// =========================
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Hanya admin yang dapat mengedit barang.',
      });
    }

    const item = await Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: 'Barang tidak ditemukan.',
      });
    }

    await item.update(req.body);

    res.json({
      message: 'Barang berhasil diperbarui.',
      item,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// =========================
// DELETE hapus barang (Admin)
// =========================
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Hanya admin yang dapat menghapus barang.',
      });
    }

    const item = await Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: 'Barang tidak ditemukan.',
      });
    }

    await item.destroy();

    res.json({
      message: 'Barang berhasil dihapus.',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
