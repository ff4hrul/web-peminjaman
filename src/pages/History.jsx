import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function History({ borrowHistory = [], onReturn }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [loadingId, setLoadingId] = useState(null);

  const safeHistory = Array.isArray(borrowHistory) ? borrowHistory : [];

  const filteredHistory = safeHistory.filter((item) => {
    const itemName = item.itemName || '';
    const borrower = item.borrower || '';

    const matchesSearch =
      itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrower.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'Semua Status' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleReturnClick = async (id) => {
    setLoadingId(id);
    await onReturn(id);
    setLoadingId(null);
  };

  return (
    <div className="history-page">
      {/* HERO HEADER */}
      <div className="history-hero">
        <div className="history-title">
          <span className="page-badge">AKTIVITAS</span>

          <h1>Riwayat Peminjaman</h1>

          <p>Daftar seluruh aktivitas peminjaman barang inventaris kampus secara real-time.</p>
        </div>
      </div>

      {/* FILTER */}
      <div className="card" style={{ marginBottom: 0 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 210px',
            gap: '12px',
          }}
        >
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />

            <input
              type="text"
              placeholder="Cari barang atau nama peminjam..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-control input-search"
            />
          </div>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select-control">
            <option value="Semua Status">Semua Status</option>
            <option value="Dipinjam">Dipinjam</option>
            <option value="Dikembalikan">Dikembalikan</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr
              style={{
                background: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                fontSize: '12px',
                color: '#64748b',
              }}
            >
              <th style={{ padding: '14px 18px' }}>ID REQ</th>
              <th style={{ padding: '14px 18px' }}>NAMA BARANG</th>
              <th style={{ padding: '14px 18px' }}>PEMINJAM</th>
              <th style={{ padding: '14px 18px' }}>TANGGAL</th>
              <th style={{ padding: '14px 18px' }}>DURASI</th>
              <th style={{ padding: '14px 18px' }}>STATUS</th>
              <th style={{ padding: '14px 18px', textAlign: 'center' }}>AKSI</th>
            </tr>
          </thead>

          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: 'center',
                    padding: '30px',
                    color: '#94a3b8',
                  }}
                >
                  Tidak ada riwayat peminjaman.
                </td>
              </tr>
            ) : (
              filteredHistory.map((item) => {
                const formattedId = `REQ-${String(item.id).padStart(3, '0')}`;

                return (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      fontSize: '14px',
                    }}
                  >
                    <td
                      style={{
                        padding: '14px 18px',
                        fontWeight: 600,
                        color: '#64748b',
                      }}
                    >
                      {formattedId}
                    </td>

                    <td
                      style={{
                        padding: '14px 18px',
                        fontWeight: 600,
                        color: '#0f172a',
                      }}
                    >
                      {item.itemName}
                    </td>

                    <td style={{ padding: '14px 18px' }}>{item.borrower}</td>

                    <td style={{ padding: '14px 18px' }}>{item.date}</td>

                    <td style={{ padding: '14px 18px' }}>{item.duration}</td>

                    <td style={{ padding: '14px 18px' }}>
                      <span className={`status-badge ${item.status === 'Dipinjam' ? 'borrowed' : 'returned'}`}>
                        {item.status}
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      {item.status === 'Dipinjam' ? (
                        <button
                          onClick={() => handleReturnClick(item.id)}
                          disabled={loadingId === item.id}
                          className="btn-primary"
                          style={{
                            padding: '8px 14px',
                            fontSize: '12px',
                          }}
                        >
                          {loadingId === item.id ? 'Proses...' : 'Kembalikan'}
                        </button>
                      ) : (
                        <span
                          style={{
                            color: '#94a3b8',
                            fontSize: '12px',
                            fontWeight: 500,
                          }}
                        >
                          Selesai
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
