import React from 'react';
import toast from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function Approval({ borrowHistory, refresh }) {
  const token = localStorage.getItem('token');

  const pending = borrowHistory.filter((item) => item.status === 'Menunggu');

  const approveBorrow = async (id) => {
    try {
      const res = await fetch(`${API_URL}/borrows/approve/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Peminjaman berhasil disetujui');
        refresh();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Server tidak dapat dihubungi');
    }
  };

  return (
    <div className="approval-page">
      {/* Header */}
      <div className="approval-hero">
        <div className="approval-title">
          <span className="page-badge">ADMIN PANEL</span>
          <h1>Approval Peminjaman</h1>
          <p>Setujui permintaan peminjaman barang dari mahasiswa sebelum barang dipinjam.</p>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-header">
          <h3>Permintaan Menunggu</h3>
        </div>

        <table className="inventory-table">
          <thead>
            <tr>
              <th>ID REQ</th>
              <th>BARANG</th>
              <th>PEMINJAM</th>
              <th>TANGGAL</th>
              <th>DURASI</th>
              <th>AKSI</th>
            </tr>
          </thead>

          <tbody>
            {pending.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-table">
                  Tidak ada permintaan peminjaman.
                </td>
              </tr>
            ) : (
              pending.map((item) => (
                <tr key={item.id}>
                  <td>{`REQ-${String(item.id).padStart(3, '0')}`}</td>
                  <td>{item.itemName}</td>
                  <td>{item.borrower}</td>
                  <td>{item.date}</td>
                  <td>{item.duration}</td>
                  <td>
                    <button className="btn-approve" onClick={() => approveBorrow(item.id)}>
                      <CheckCircle size={16} />
                      Setujui
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
