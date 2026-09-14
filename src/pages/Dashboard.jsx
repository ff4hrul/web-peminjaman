import React, { useMemo } from 'react';
import { Package, CheckCircle2, Clock3, ClipboardList, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#2563EB', '#F59E0B'];

export default function Dashboard({ items, borrowHistory, onBorrow, onApprove, user }) {
  const totalProducts = items.reduce((a, b) => a + b.total, 0);
  const inStock = items.reduce((a, b) => a + b.available, 0);
  const borrowed = totalProducts - inStock;
  const totalTransaction = borrowHistory.length;

  const availablePercent = totalProducts === 0 ? 0 : Math.round((inStock / totalProducts) * 100);

  const barData = Object.values(
    items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          category: item.category,
          total: 0,
        };
      }

      acc[item.category].total += item.total;
      return acc;
    }, {}),
  );

  const pieData = [
    { name: 'Tersedia', value: inStock },
    { name: 'Dipinjam', value: borrowed },
  ];

  const latestItems = useMemo(() => [...items].slice(0, 6), [items]);

  const recentActivity = useMemo(() => [...borrowHistory].slice(0, 5), [borrowHistory]);

  const pendingRequests = useMemo(() => borrowHistory.filter((item) => item.status === 'Menunggu'), [borrowHistory]);

  return (
    <div className="dashboard">
      {/* Statistik */}
      <div className="stats-grid">
        <StatCard title="Total Barang" value={totalProducts} icon={<Package size={22} />} color="#2563EB" />

        <StatCard title="Tersedia" value={inStock} icon={<CheckCircle2 size={22} />} color="#16A34A" />

        <StatCard title="Dipinjam" value={borrowed} icon={<Clock3 size={22} />} color="#F59E0B" />

        <StatCard title="Transaksi" value={totalTransaction} icon={<ClipboardList size={22} />} color="#7C3AED" />
      </div>

      {/* Analytics */}
      <div className="analytics-grid">
        <div className="chart-card">
          <div className="card-title">
            <div>
              <h3>Inventaris per Kategori</h3>
              <p>Distribusi jumlah barang</p>
            </div>
            <TrendingUp size={20} color="#2563EB" />
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="#2563EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card small">
          <h3>Status Inventaris</h3>

          <div className="donut-wrapper">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} innerRadius={52} outerRadius={72} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="donut-center">
              <h2>{availablePercent}%</h2>
              <span>Tersedia</span>
            </div>
          </div>

          <div className="legend">
            <span>
              <i style={{ background: '#2563EB' }} />
              Tersedia ({inStock})
            </span>

            <span>
              <i style={{ background: '#F59E0B' }} />
              Dipinjam ({borrowed})
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-grid">
        {/* Inventaris */}
        <div className="table-card">
          <div className="table-header">
            <h3>Daftar Inventaris</h3>
          </div>

          <table className="inventory-table">
            <thead>
              <tr>
                <th>Barang</th>
                <th>Kategori</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {latestItems.map((item) => (
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
                      {item.available} tersedia
                    </span>
                  </td>

                  <td>
                    {user.role === 'user' && (
                      <button
                        className="btn-table"
                        disabled={item.available === 0}
                        onClick={() => onBorrow(item.id, '1 Hari')}
                      >
                        Pinjam
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Panel Kanan */}
        <div className="activity-card">
          {user.role === 'admin' ? (
            <>
              <h3>Approval Peminjaman</h3>

              {pendingRequests.length === 0 ? (
                <p className="empty-text">Tidak ada permintaan peminjaman.</p>
              ) : (
                pendingRequests.map((item) => (
                  <div className="activity-item" key={item.id}>
                    <div className="activity-avatar">{item.borrower.charAt(0).toUpperCase()}</div>

                    <div className="activity-info">
                      <strong>{item.borrower}</strong>
                      <p>{item.itemName}</p>
                    </div>

                    <button className="approve-btn" onClick={() => onApprove(item.id)}>
                      Setujui
                    </button>
                  </div>
                ))
              )}
            </>
          ) : (
            <>
              <h3>Aktivitas Terbaru</h3>

              {recentActivity.length === 0 ? (
                <p className="empty-text">Belum ada transaksi.</p>
              ) : (
                recentActivity.map((item) => (
                  <div className="activity-item" key={item.id}>
                    <div className="activity-avatar">{item.borrower.charAt(0).toUpperCase()}</div>

                    <div className="activity-info">
                      <strong>{item.borrower}</strong>
                      <p>{item.itemName}</p>
                    </div>

                    <span
                      className={`status ${
                        item.status === 'Dikembalikan' ? 'success' : item.status === 'Menunggu' ? 'warning' : 'danger'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="stat-card">
      <div
        className="stat-icon"
        style={{
          background: `${color}15`,
          color,
        }}
      >
        {icon}
      </div>

      <div className="stat-info">
        <p>{title}</p>
        <h2>{value}</h2>
      </div>
    </div>
  );
}
