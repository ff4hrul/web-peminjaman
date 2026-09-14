import React, { useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from '../components/ConfirmDialog';

const API_URL = import.meta.env.VITE_API_URL;

export default function ManageItems({ items, refreshItems }) {
  const token = localStorage.getItem('token');

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');

  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category: '',
    total: '',
  });

  const categories = ['Semua', ...new Set(items.map((item) => item.category))];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchName = item.name.toLowerCase().includes(search.toLowerCase());

      const matchCategory = category === 'Semua' || item.category === category;

      return matchName && matchCategory;
    });
  }, [items, search, category]);

  // ==========================
  // Tambah Barang
  // ==========================
  const openAdd = () => {
    setEditingId(null);
    setForm({
      name: '',
      category: '',
      total: '',
    });
    setShowModal(true);
  };

  // ==========================
  // Edit Barang
  // ==========================
  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      total: item.total,
    });
    setShowModal(true);
  };

  // ==========================
  // Simpan Data
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId ? `${API_URL}/items/${editingId}` : `${API_URL}/items`;

    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          total: Number(form.total),
          available: Number(form.total),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(editingId ? 'Barang berhasil diperbarui' : 'Barang berhasil ditambahkan');

        setShowModal(false);
        refreshItems();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Server tidak dapat dihubungi');
    }
  };

  // ==========================
  // Hapus Barang
  // ==========================
  const handleDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API_URL}/items/${deleteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Barang berhasil dihapus');
        refreshItems();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Server tidak dapat dihubungi');
    }

    setShowConfirm(false);
    setDeleteId(null);
  };

  return (
    <>
      {/* ================= HERO ================= */}
      <div className="inventory-hero">
        <div className="inventory-header">
          <div className="inventory-title">
            <span className="page-badge">ADMIN PANEL</span>

            <h1>Kelola Inventaris</h1>

            <p>Tambahkan, ubah, dan kelola seluruh data barang inventaris kampus secara real-time.</p>
          </div>

          <button className="btn-add-item" onClick={openAdd}>
            <Plus size={18} />
            Tambah Barang
          </button>
        </div>
      </div>

      {/* ================= TOOLBAR ================= */}
      <div className="inventory-toolbar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Cari nama barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <div className="table-card">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Barang</th>
              <th>Kategori</th>
              <th>Total</th>
              <th>Tersedia</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>

                <td>{item.category}</td>

                <td>{item.total}</td>

                <td>
                  <span
                    className={`status ${
                      item.available === 0 ? 'danger' : item.available <= 2 ? 'warning' : 'success'
                    }`}
                  >
                    {item.available}
                  </span>
                </td>

                <td>
                  <div className="table-actions">
                    <button className="icon-btn" onClick={() => openEdit(item)}>
                      <Pencil size={16} />
                    </button>

                    <button className="icon-btn delete" onClick={() => handleDelete(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredItems.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-table">
                  Tidak ada barang yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingId ? 'Edit Barang' : 'Tambah Barang'}</h3>

              <button onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nama Barang"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <input
                type="text"
                placeholder="Kategori"
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
                required
              />

              <input
                type="number"
                placeholder="Jumlah Stok"
                value={form.total}
                onChange={(e) => setForm({ ...form, total: e.target.value })}
                required
              />

              <button type="submit" className="btn-primary">
                {editingId ? 'Simpan Perubahan' : 'Tambah Barang'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= KONFIRMASI HAPUS ================= */}
      <ConfirmDialog
        open={showConfirm}
        title="Hapus Barang?"
        message="Barang yang dihapus tidak dapat dikembalikan."
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowConfirm(false);
          setDeleteId(null);
        }}
      />
    </>
  );
}
