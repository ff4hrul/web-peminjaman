import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import ManageItems from './pages/ManageItems';
import Approval from './pages/Approval';

import './App.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const [items, setItems] = useState([]);
  const [borrowHistory, setBorrowHistory] = useState([]);

  // ==========================
  // Ambil user dari sessionStorage
  // ==========================
  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // ==========================
  // Fetch Barang
  // ==========================
  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/items`);

      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengambil data barang');
    }
  };

  // ==========================
  // Fetch Riwayat
  // ==========================
  const fetchHistory = async () => {
    const token = sessionStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/borrows`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setBorrowHistory(data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengambil riwayat');
    }
  };

  // Load data setelah login
  useEffect(() => {
    if (user) {
      fetchItems();
      fetchHistory();
    }
  }, [user]);

  // ==========================
  // Ajukan Pinjam
  // ==========================
  const handleBorrow = async (itemId, duration) => {
    const token = sessionStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/borrows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId,
          duration,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Permintaan berhasil dikirim');
        fetchHistory();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Server tidak dapat dihubungi');
    }
  };

  // ==========================
  // Kembalikan Barang
  // ==========================
  const handleReturn = async (id) => {
    const token = sessionStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/borrows/return/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Barang berhasil dikembalikan');
        fetchItems();
        fetchHistory();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Server tidak dapat dihubungi');
    }
  };

  // ==========================
  // Approve Peminjaman (ADMIN)
  // ==========================
  const handleApprove = async (id) => {
    const token = sessionStorage.getItem('token');

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
        fetchItems();
        fetchHistory();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Server tidak dapat dihubungi');
    }
  };

  // ==========================
  // Logout
  // ==========================
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    setUser(null);
    setCurrentPage('dashboard');

    toast.success('Berhasil logout');
  };

  if (loading) return <h2>Loading...</h2>;

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="app-layout">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} onLogout={handleLogout} />

      <main className="main-content">
        {currentPage === 'dashboard' && (
          <Dashboard
            items={items}
            borrowHistory={borrowHistory}
            onBorrow={handleBorrow}
            onApprove={handleApprove}
            user={user}
          />
        )}

        {currentPage === 'history' && <History borrowHistory={borrowHistory} onReturn={handleReturn} user={user} />}

        {currentPage === 'approval' && user.role === 'admin' && (
          <Approval
            borrowHistory={borrowHistory}
            refresh={() => {
              fetchItems();
              fetchHistory();
            }}
          />
        )}

        {currentPage === 'items' && user.role === 'admin' && <ManageItems items={items} refreshItems={fetchItems} />}
      </main>
    </div>
  );
}

